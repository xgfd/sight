from typing import Tuple

import cv2

from builtin import Circle


def main(
    image: object,
    _circle: Circle,
    dsize_h: int,
    dsize_w: int,
    interpolation_flag: int,
    warp_mode: int,
) -> Tuple[object, Circle]:
    """

    Args:
        image (object): Input image.
        _circle (Circle): Input data. The transformation circle.
        dsize_h (int): The destination image height.
        dsize_w (int): The destination image width.
        interpolation_flag (int): Interpolation method.
        warp_mode (int): Warp method.

    Returns:
        object, Circle: Transformed image; The transformation circle.
    """
    center, maxRadius = _circle
    polar_image = cv2.warpPolar(
        image, (dsize_h, dsize_w), center, maxRadius, interpolation_flag + warp_mode
    )

    return polar_image, _circle
