from typing import Tuple

import cv2
import numpy as np

from . import Circle


def main(
    image: np.ndarray,
    _circle: Circle,
    dsize_h: int,
    dsize_w: int,
    interpolation_flag: int,
    warp_mode: int,
    inverse_map: int,
) -> Tuple[np.ndarray, Circle]:
    """

    Args:
        image (np.ndarray): Input image.
        _circle (Circle): Input data. The transformation circle.
        dsize_h (int): The destination image height.
        dsize_w (int): The destination image width.
        interpolation_flag (int): Interpolation method.
        warp_mode (int): Warp method.
        inverse_map (int): 16 (cv2.WARP_INVERSE_MAP) for the inverse warp, 0 otherwise.

    Returns:
        np.ndarray, Circle: Transformed image; The transformation circle.
    """
    center, maxRadius = _circle
    polar_image = cv2.warpPolar(
        image,
        (dsize_h, dsize_w),
        center,
        maxRadius,
        interpolation_flag + warp_mode + inverse_map,
    )

    return polar_image, _circle
