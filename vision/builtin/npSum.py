from typing import List, Tuple

import numpy as np


def main(image: object, axis=0) -> List:
    """Sum of array elements over a given axis.

    Args:
        image (object): Input image that is simply passed on.
        axis (int, optional): Axis along which a sum is performed. Defaults to 0.

    Returns:
        List: An array with the same shape as the input, with the specified axis removed.
    """
    return np.sum(image, axis=axis)
