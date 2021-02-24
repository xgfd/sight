from typing import List, Tuple

import numpy as np


def main(image: object, _list: List, axis=0) -> Tuple[object, List]:
    """Add one dimension at the give axis.

    Args:
        image (object): Input image that is simply passed on.
        _list (List): Input list to be expanded.
        axis (int, optional): Position in the expanded axes where the new axis is placed. Defaults to 0.

    Returns:
        Tuple[object, List]: The input image; the expanded list.
    """
    return image, np.expand_dims(_list, axis=axis)
