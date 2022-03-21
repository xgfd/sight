from typing import List, Tuple

import numpy as np


def main(image: np.ndarray, _list: List, axis=0) -> Tuple[np.ndarray, List]:
    """Add one dimension at the give axis.

    Args:
        image (np.ndarray): Input image that is simply passed on.
        _list (List): Input list to be expanded.
        axis (int, optional): Position in the expanded axes where the new axis is placed. Defaults to 0.

    Returns:
        Tuple[np.ndarray, List]: The input image; the expanded list.
    """
    return image, np.expand_dims(_list, axis=axis)
