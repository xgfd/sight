from __future__ import annotations

import hashlib
import importlib
import inspect
import json
import sys
from pathlib import Path
from threading import Thread
from typing import Callable, List, Tuple, TypedDict, Union

# import all builtin and custom submodules
# see __init__.py of the two modules
import builtin
import custom
from cv2 import IMREAD_UNCHANGED, IMWRITE_PNG_COMPRESSION, imread, imwrite

# function shortcuts
FUNCTIONS = {}
# image cache folder
CACHE = Path(__file__).parent / ".cache"

# def _export_fn(fn):
#     """Export the main function as source code.
#     Function name is replaced with the module name.

#     Returns:
#         str: Renamed main function source code.
#     """

#     fn_name = fn.__module__.split(".")[-1]
#     source = inspect.getsource(fn)
#     return source.replace("def main", f"def {fn_name}")


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


def _init():
    # initiate function shortcuts
    global FUNCTIONS

    modules = [builtin, custom]
    for mod in modules:
        module_name = mod.__name__
        for sub_name in mod.__all__:
            full_sub_name = f"{module_name}.{sub_name}"
            FUNCTIONS[full_sub_name] = sys.modules[full_sub_name].main
    # make sure that image cache folder exists
    CACHE.mkdir(parents=True, exist_ok=True)


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

    op_seq: List[Op] = json.loads(req)
    try:
        image = None
        input_hash = ""

        first_op = op_seq[0]
        # resume cached image and the input hash if the current op is not imread
        if "imread" not in first_op["fn"]:
            last_hash = first_op.get("last_hash", "")
            image = _get_image(last_hash)
            input_hash = last_hash
            if image is None:
                raise CacheError(f"{last_hash}.png not found")

        for op in op_seq:
            fn_name = op["fn"]
            if "imread" in fn_name:
                image = None
                input_hash = ""
            fn = FUNCTIONS[fn_name]
            args = op["args"]
            image, input_hash = _run_step(
                fn, image, args, {"rid": op["rid"], "input_hash": input_hash}
            )
    except KeyError as e:
        print(e)
        print(json.dumps(False))
    except CacheError as e:
        print(e)
        print(json.dumps(False))


def _run_step(
    fn: Callable, image: Union[None, object], args: List, context: Context
) -> Tuple[object, str]:
    input_hash = context["input_hash"]
    rid = context["rid"]
    ret_hash = _ret_hash(fn, input_hash, args)
    ret_image = _get_image(ret_hash)

    # only save image if there's no cache
    save = False
    if ret_image is None:

        # image is None for imread
        # and the first parameter in args should be a file path
        # otherwise insert the image object at the beginning
        if image is not None:
            args = (image, *args)
        ret_image = fn(*args)
        # allow multiple returns
        if isinstance(ret_image, tuple):
            ret_image = ret_image[0]
        assert ret_image is not None
        save = True

    # cache the result image and send a response
    Thread(
        target=_respond,
        args=(None, rid, ret_hash, ret_image, save),
    ).start()
    # _respond(None, rid, ret_hash, ret_image, save)

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


def _respond(conn, rid: str, ret_hash: str, ret_image: object, save=True):
    res = {"rid": rid, "ret_hash": ret_hash}
    if save:
        # print("saving", flush=True)
        saved = _save_image(ret_hash, ret_image)
        if not saved:
            res["ret_hash"] = None
    res_str = json.dumps(res)
    print(res_str, flush=True)


_init()

if __name__ == "__main__":

    # print(ls())
    # import time
    # time.sleep(10)
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

    # print(ls())
