from typing import Tuple
import cv2


def main(
    image: object,
    _circle: Tuple[Tuple[float, float], float],
    dsize_h: int,
    dsize_w: int,
    interpolation_flag: int,
    warp_mode: int,
):
    """

    Args:
        image (object): Input image.
        _circle (Tuple[Tuple[float, float], float]): Input data. The transformation circle.
        dsize_h (int): The destination image height.
        dsize_w (int): The destination image width.
        interpolation_flag (int): Interpolation method.
        warp_mode (int): Warp method.

    Returns:
        object, Circle: Transformed image; the transformation circle.
    """
    center, maxRadius = _circle
    polar_image = cv2.warpPolar(
        image, (dsize_h, dsize_w), center, maxRadius, interpolation_flag + warp_mode
    )

    return polar_image, _circle
