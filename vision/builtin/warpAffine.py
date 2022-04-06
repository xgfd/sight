from typing import List

import cv2
import numpy as np


def main(
    image: np.ndarray,
    transformation: List[float],
    interpolation: int,
    inverse_map: int,
    border_mode: int,
    border_value: int,
) -> np.ndarray:
    """OpenCV warpAffine.

    Args:
        image (np.ndarray): Input image.
        transformation (List[float]): Transformation matrix as an array.
        interpolation (int): Interpolation method.
        inverse_map (int): 16 (cv2.WARP_INVERSE_MAP) for the inverse warp, 0 otherwise.
        border_mode (int): Pixel extrapolation method.
        border_value (int): Value used in case of a constant border.

    Returns:
        np.ndarray: Transformed image.
    """
    transformation_matrix = np.array(transformation, dtype=np.float).reshape((2, 3))
    dsize = (image.shape[1], image.shape[0])
    warped_image = cv2.warpAffine(
        image,
        M=transformation_matrix,
        dsize=dsize,
        flags=interpolation + inverse_map,
        borderMode=border_mode,
        borderValue=border_value,
    )
    return warped_image
