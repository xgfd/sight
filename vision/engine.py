from __future__ import annotations

import hashlib
import importlib
import inspect
import json
import shlex
import sys
import traceback
from pathlib import Path
from typing import Callable, List, Tuple, TypedDict, Union
from zipfile import ZipFile

import builtin  # import all builtin functions, see __init__.py
import custom  # import all builtin functions, see __init__.py
import cv2
import numpy as np

# function shortcuts
# FUNCTIONS: {pack.module: Callable}
FUNCTIONS = {}

# the following paths much be in sync with the main app (src/constants.ts)
# they are initialised in _init()
APP_DATA = (Path.home() / ".sight").absolute()
# image cache folder
CACHE = (APP_DATA / "cache").resolve()
BUILTIN = Path(".") / "builtin"
CUSTOM = Path(".") / "custom"

# # add custom functions to search paths
# CUSTOM.mkdir(parents=True, exist_ok=True)
# sys.path.insert(0, str(APP_DATA))
# # copy builtin/__inti__.py to CUSTOM to import all sub modules
# shutil.copyfile(BUILTIN / "__init__.py", CUSTOM / "__init__.py")
# # now it automatically imports all custom functions


class Context(TypedDict):
    input_hash: str
    rid: str


class Op(TypedDict):
    rid: str
    fn: str
    last_hash: str
    args: List[Union[int, float, str]]


def _ret_hash(fn: Callable, inputhash: str, args: List) -> str:
    """Calculate result hash of a function call.
    This hash is used as the id of the output image of this call.

    Args:
        fn (Callable): Function of this call.
        inputhash (str): Result hash of the last step.
        args (List): Arguments of this call.

    Returns:
        str: Result hash of this call.
    """
    source = inspect.getsource(fn)
    data = ":".join([inputhash, json.dumps(args), source])
    hash = hashlib.sha256(data.encode()).hexdigest()
    return hash


def _run_step(
    fn_name: str,
    image: Union[None, object],
    data: Tuple,
    control_args: List,
    rid: str,
    input_hash: str,
) -> Tuple[Union[None, object], Union[None, Tuple], str]:
    """Run a single operation and always return an image and a result hash for the next iteration.
    The result image (if not None) is cached and a response is sent to the client.

    If the current run failed empty image and result hash are returned.
    An empty input image probably fails the current run unless it's imread.

    Regardless of the result of a single the run sequence continues and results are returned.

    Args:
        fn_name (str): The full function name (package.module).
        image (Union[None, object]): Input image.
        data (Tuple): Other data returned from the last execution.
        control_args (List): Input arguments from the frontend.
        rid (str): Request id of this run.
        input_hash (str): Input hash corresponding to the input image.

    Returns:
        Tuple[Union[None, object], str]: Result image and hash for the next iteration.
    """

    package, module_name = fn_name.split(".")

    # non-imread functions need a valid input image
    # otherwise response and return
    if module_name != "imread" and image is None:
        # reset input image and hash
        ret_image = None
        ret_data = ()
        ret_hash = ""
        error = "No input image. The previous step probably failed."
        _respond_and_cache(rid, ret_hash, ret_image, ret_data, error)
        return ret_image, ret_data, ret_hash
    # ************************

    fn = None
    save = False
    # if the function is not loaded return early
    try:
        fn = FUNCTIONS[fn_name]
    except KeyError:
        ret_image = None
        ret_data = ()
        ret_hash = ""
        error = f"{package} function {module_name} is not loaded."
        _respond_and_cache(rid, ret_hash, ret_image, ret_data, error)
        return ret_image, ret_data, ret_hash
    # ************************

    # the result is determined by the function body (should be the module content) and arguments
    # the arguments consist of an input image (represent by the input_hash) followed by args
    # before run we can predicate the result hash
    # there's no need to run the function if the result hash matches a cached image
    input_hash = "" if module_name == "imread" else input_hash
    ret_hash = _ret_hash(fn, input_hash, control_args)
    ret_image, ret_data = _get_result(ret_hash)
    error: Union[str, None] = None

    if not ret_hash or ret_image is None:
        # no cache, we need to run this function
        try:
            if module_name == "imread":
                # imread takes no input image
                result = fn(*data, *control_args)
            else:
                # insert the image object at the beginning for non-imread
                result = fn(image, *data, *control_args)
            # function returned multiple values
            if type(result) is tuple:
                ret_image, *ret_data = result
            else:
                ret_image = result
                ret_data = ()

            # allow multiple returns but the first one should be an image
            if isinstance(ret_image, tuple):
                ret_image = ret_image[0]

            if ret_image is not None:
                save = True
            else:
                error = "Invalid result image"
        except Exception:
            ret_image = None
            ret_data = ()
            ret_hash = ""
            error = str(traceback.format_exc())

    _respond_and_cache(rid, ret_hash, ret_image, ret_data, error, save)

    return ret_image, ret_data, ret_hash


def _save_result(hash: str, image: object, data: Union[None, Tuple] = None) -> bool:
    """Save a result image and other data to cache.

    Args:
        hash (str): Result hash used as the name of this image.
        image (object): Result image of a function call.
        data (Tuple): Other result data as a tuple.

    Returns:
        bool: True if the result is saved.
    """
    imagepath = str(CACHE / f"{hash}.png")
    datapath = str(CACHE / f"{hash}.npy")
    data = np.array(data)
    # save as loseless png
    try:
        cv2.imwrite(imagepath, image, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])
        np.save(datapath, data)
        return True
    except Exception:
        return False


def _get_result(hash: str) -> Union[Tuple[None, None], Tuple[object, Tuple]]:
    """Get an cached image.

    Args:
        hash (str): A result hash that identifies an image.

    Returns:
        None or Tuple: Cached image followed by optional data if it's found in cache. None otherwise.
    """
    imagepath = str(CACHE / f"{hash}.png")
    image = None
    datapath = str(CACHE / f"{hash}.npy")
    data = []
    try:
        image = cv2.imread(imagepath, cv2.IMREAD_UNCHANGED)
        data = np.load(datapath)
    except Exception:
        pass
    return image, data


def _respond_and_cache(
    rid: str,
    ret_hash: str,
    ret_image: object,
    ret_data: Tuple,
    error: str = None,
    save=False,
):
    """Respond to a client and by default cache the result image.

    Args:
        rid (str): Request id.
        ret_hash (str): Result hash.
        ret_image (object): Result image.
        ret_data (Tuple): Other data returned by a function call.
        error (str, optional): Optional error message. Defaults to None.
        save (bool, optional): Cache the result image under result hash. Defaults to False.
        conn (object, optional): Connection with a client. Not used for now. Defaults to None.
    """
    res = {"rid": rid, "ret_hash": ret_hash, "error": error}
    if save and error is None and ret_hash and ret_image is not None:
        saved = _save_result(ret_hash, ret_image, ret_data)
        if not saved:
            res["ret_hash"] = ""
    res_str = json.dumps(res)
    print(f"{res_str}\n", end="", flush=True)


def _parse_and_exec(line: str):
    cmd, *args = shlex.split(line)
    try:
        res = globals()[cmd](*args)
        if res is not None:
            res_str = json.dumps(res)
            print(res_str, flush=True)
    except Exception as e:
        print(e)


def _init():
    """Set up required folders and load builtin and custom functions."""
    # make sure that image cache folder exists
    # the main app will create these two folders too
    CACHE.mkdir(parents=True, exist_ok=True)

    # initiate function shortcuts
    global FUNCTIONS

    modules = [builtin, custom]
    for mod in modules:
        module_name = mod.__name__
        for sub_name in mod.__all__:
            full_sub_name = f"{module_name}.{sub_name}"
            FUNCTIONS[full_sub_name] = sys.modules[full_sub_name].main


def echo(line):
    print(line)


def export(req: str):
    """Export a sequence of operations as a Python package archive.

    Returns:
        str: Path to the exported archive.
    """
    operations: List[Op] = json.loads(req)
    config = {}
    index_imports = ["import json"]

    main_header = """
def main(image):
    with open("config.json") as c:
        config = json.load(c)
"""
    index_main = [main_header]
    main_body = []
    with ZipFile("archive.zip", "w") as zip:
        # remove imread on top
        if operations[0]["fn"] == "builtin.imread":
            operations = operations[1:]
        for op in operations:
            package, module = op["fn"].split(".")
            scriptfile = Path(package) / f"{module}.py"
            zip.write(scriptfile)
            index_imports.append(f'from {op["fn"]} import main as {module}')
            main_body.append(f'args = config["{module}"]')
            main_body.append(f"image, *data = {module}(image, *args)")
            config[module] = op["args"]
        main_body.append("return data")
        import_str = "\n".join(index_imports)
        index_main.extend(main_body)
        main_str = "\n\n    ".join(index_main)
        zip.writestr("index.py", f"{import_str}\n\n{main_str}\n")
        zip.writestr("config.json", json.dumps(config))

    return str(Path("archive.zip").resolve())


def ls():
    """List loaded functions.

    Returns:
        List[str]: List of function names.
    """
    return list(FUNCTIONS.keys())


def upsert(full_module_name: str) -> bool:
    """Load a new function or update a loaded function.

    Args:
        full_module_name (str): Function name "package.module".

    Returns:
        bool: True if the function is successfully loaded or updated.
    """
    try:
        pack_name, m_name = full_module_name.split(".")

        package = sys.modules[pack_name]

        try:
            # existing module?
            m = sys.modules[full_module_name]
            importlib.reload(m)
        except KeyError:
            # new module
            m = importlib.import_module(full_module_name)
            package.__all__.append(m_name)

        # update function shortcuts
        global FUNCTIONS
        FUNCTIONS[full_module_name] = m.main
        return True
    except Exception:
        # print(e)
        return False


def rm(full_module_name: str) -> bool:
    """Unload a function.

    Args:
        full_module_name (str): Function name "package.module".

    Returns:
        bool: Always return True.
    """
    try:
        del sys.modules[full_module_name]
    except KeyError:
        pass
    return True


def run(req: str):
    """Execute a sequence of operations and respond for each operation.

    Args:
        req (str): Json string of the sequence of operations to be executed.
    """
    # the input image and hash for each step, updated during each iteration
    image = None
    data = []
    input_hash = ""

    # the operation sequence to be executed
    op_seq: List[Op] = json.loads(req)

    top_op = op_seq[0]

    # if the current op is not imread, resume cached image and the input hash
    if top_op["fn"].split(".")[-1] != "imread":
        sequence_input_hash = top_op.get("last_hash", "")

        image, data = _get_result(sequence_input_hash)
        input_hash = sequence_input_hash

        if image is None:
            _respond_and_cache(
                top_op["rid"],
                "",
                None,
                None,
                "Cached input image is missing. Run imread again.",
            )
            return

    # image and input_hash might be empty if the previous iteration failed
    # this doesn't mean all the followed operations fail
    # since there might be an imread later
    # _run_step takes care of it
    for op in op_seq:
        fn_name = op["fn"]
        rid = op["rid"]
        control_args = op["args"]

        # execute and set input image and hash for the next iteration
        image, data, input_hash = _run_step(
            fn_name, image, data, control_args, rid, input_hash
        )


_init()

if __name__ == "__main__":

    try:
        for line in sys.stdin:
            # strip off '\n'
            line = line[:-1]
            _parse_and_exec(line)

    except KeyboardInterrupt:
        sys.stdout.flush()
        sys.exit()
