from typing import List

import numpy as np


def main(image: np.ndarray, axis=0) -> List:
    """Sum of array elements over a given axis.

    Args:
        image (np.ndarray): Input image that is simply passed on.
        axis (int, optional): Axis along which a sum is performed. Defaults to 0.

    Returns:
        List: An array with the same shape as the input, with the specified axis removed.
    """
    return np.sum(image, axis=axis)
