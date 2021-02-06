from __future__ import annotations

import hashlib
import importlib
import inspect
import json
import sys
from pathlib import Path
from threading import Thread
from typing import Callable, List, Tuple, TypedDict, Union

import builtin  # import all builtin functions, see __init__.py
import custom  # import all builtin functions, see __init__.py
from cv2 import IMREAD_UNCHANGED, IMWRITE_PNG_COMPRESSION, imread, imwrite

# function shortcuts
# FUNCTIONS: {pack.module: Callable}
FUNCTIONS = {}

# the following paths much be in sync with the main app (src/constants.ts)
# they are initialised in _init()
APP_DATA = (Path.home() / ".sight").absolute()
# image cache folder
CACHE = APP_DATA / "cache"
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


class CacheError(Exception):
    pass


def _export_module(m):
    """Export a module's main function as source code.
    The main function is renamed to the module name.

    Returns:
        str: Renamed module main function source code.
    """

    fn_name = m.__name__.split(".")[-1]
    source = inspect.getsource(m)
    return source.replace("def main", f"def {fn_name}")


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
    fn_name: str, image: Union[None, object], args: List, rid: str, input_hash: str
) -> Tuple[Union[None, object], str]:
    """Run a single operation and always return an image and a result hash for the next iteration.
    The result image (if not None) is cached and a response is sent to the client.

    If the current run failed empty image and result hash are returned.
    An empty input image probably fails the current run unless it's imread.

    Regardless of the result of a single the run sequence continues and results are returned.

    Args:
        fn_name (str): The full function name (package.module).
        image (Union[None, object]): Input image.
        args (List): Other input arguments apart from the input image.
        rid (str): Request id of this run.
        input_hash (str): Input hash corresponding to the input image.

    Returns:
        Tuple[Union[None, object], str]: Result image and hash for the next iteration.
    """

    module_name = fn_name.split(".")[-1]

    # non-imread functions need a valid input image
    if module_name != "imread" and image is None:
        # reset input image and hash
        ret_image = None
        ret_hash = ""
        error = "No input image. The previous step probably failed."
        _respond_and_cache(rid, ret_hash, ret_image, error)
        return ret_image, ret_hash

    # the result is determined by the function body (should be the module content) and arguments
    # the arguments consist of an input image (represent by the input_hash) followed by args
    # before run we can predicate the result hash
    # there's no need to run the function if the result hash matches a cached image
    fn = FUNCTIONS[fn_name]
    ret_hash = _ret_hash(fn, input_hash, args)
    ret_image = _get_image(ret_hash)

    if ret_hash and ret_image:
        # no cache, we need to run this function

        # insert the image object at the beginning for non-imread
        if module_name != "imread":
            args = (image, *args)

        try:
            ret_image = fn(*args)
            # allow multiple returns but the first one should be an image
            if isinstance(ret_image, tuple):
                ret_image = ret_image[0]

            if ret_image is not None:

                # cache the result image and send a response
                Thread(
                    target=_respond_and_cache,
                    args=(rid, ret_hash, ret_image),
                ).start()
            else:
                # no need to use a thread if not saving image
                _respond_and_cache(rid, ret_hash, ret_image, "Invalid result image")
        except Exception as e:
            ret_image = None
            ret_hash = ""
            _respond_and_cache(rid, ret_hash, ret_image, str(e))

    return ret_image, ret_hash


def _save_image(hash: str, image: object) -> bool:
    """Save an image to cache.

    Args:
        hash (str): Result hash used as the name of this image.
        image (object): Result image of a function call.

    Returns:
        bool: True if the image is saved.
    """
    filepath = CACHE / f"{hash}.png"
    # save as loseless png
    return imwrite(str(filepath.resolve()), image, [int(IMWRITE_PNG_COMPRESSION), 0])


def _get_image(hash: str) -> Union[None, object]:
    """Get an cached image.

    Args:
        hash (str): A result hash that identifies an image.

    Returns:
        None or object: The image if it's found in cache. None otherwise.
    """
    filepath = CACHE / f"{hash}.png"
    image = None
    try:
        image = imread(str(filepath.resolve()), IMREAD_UNCHANGED)
    except Exception:
        pass
    return image


def _respond_and_cache(
    rid: str, ret_hash: str, ret_image: object, error: str = None, conn=None
):
    """Respond to a client and by default cache the result image.

    Args:
        rid (str): Request id.
        ret_hash (str): Result hash.
        ret_image (object): Result image.
        save (bool, optional): Cache the result image under result hash. Defaults to True.
        error (str, optional): Optional error message. Defaults to None.
        conn (object, optional): Connection with a client. Not used for now. Defaults to None.
    """
    res = {"rid": rid, "ret_hash": ret_hash, "error": error}
    if ret_hash and ret_image:
        saved = _save_image(ret_hash, ret_image)
        if not saved:
            res["ret_hash"] = ""
    res_str = json.dumps(res)
    print(res_str, flush=True)


def _init():
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


def ls():
    return list(FUNCTIONS.keys())


def upsert(mod: str):
    try:
        # only allow new modules under custom
        package = "custom"
        full_module_name = package + "." + mod

        if mod in custom.__all__:
            m = importlib.reload(getattr(custom, mod))
        else:
            m = importlib.import_module(full_module_name)
            custom.__all__.append(mod)

        # update function shortcuts
        global FUNCTIONS
        FUNCTIONS[full_module_name] = m.main
        return True
    except Exception as e:
        print(e)
        return False


def run(req: str):
    # the input image and hash for each step, updated during each iteration
    image = None
    input_hash = ""

    # the operation sequence to be executed
    op_seq: List[Op] = json.loads(req)

    try:
        top_op = op_seq[0]

        # if the current op is not imread, resume cached image and the input hash
        if top_op["fn"].split(".")[-1] != "imread":
            sequence_input_hash = top_op.get("last_hash", "")

            image = _get_image(sequence_input_hash)
            input_hash = sequence_input_hash

            if image is None:
                raise CacheError(f"{sequence_input_hash}.png not found")

        # image and input_hash might be empty if the previous iteration failed
        # this doesn't mean all the followed operations fail
        # since there might be an imread later
        # _run_step takes care of it
        for op in op_seq:
            fn_name = op["fn"]
            rid = op["rid"]
            args = op["args"]

            # execute and set input image and hash for the next iteration
            image, input_hash = _run_step(fn_name, image, args, rid, input_hash)
    except KeyError as e:
        print(e)
        print(json.dumps(False))
    except CacheError as e:
        print(e)
        print(json.dumps(False))


_init()

if __name__ == "__main__":

    cmd = sys.argv[1]
    args = []
    if len(sys.argv) > 2:
        args = sys.argv[2:]
    try:
        ret = globals()[cmd](*args)
        if ret is not None:
            print(json.dumps(ret))
    except Exception as e:
        print(e)
        print(json.dumps(None))
