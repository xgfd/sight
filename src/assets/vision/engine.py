import hashlib
import inspect
import json
from typing import List

from builtin import *


def export_fn(fn):
    """Export the main function as source code.
    Function name is replaced with the module name.

    Returns:
        str: Renamed main function source code.
    """

    fn_name = fn.__module__.split(".")[-1]
    source = inspect.getsource(fn)
    return source.replace("def main", f"def {fn_name}")


def export_module(m):
    """Export a module function as source code.
    The main function name is renamed to the module name.

    Returns:
        str: Renamed module source code.
    """

    fn_name = m.__name__.split(".")[-1]
    source = inspect.getsource(m)
    return source.replace("def main", f"def {fn_name}")


def ret_hash(inputhash: str, args: List, fn):
    source = inspect.getsource(fn)
    data = ":".join([inputhash, json.dumps(args), source])
    hash = hashlib.sha256(data.encode()).hexdigest()
    return hash
