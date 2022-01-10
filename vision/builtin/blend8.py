from typing import Literal

import cv2
import numpy as np
from numpy import ndarray


def main(
    image1: ndarray,
    image2: ndarray,
    image3: ndarray,
    image4: ndarray,
    image5: ndarray,
    image6: ndarray,
    image7: ndarray,
    image8: ndarray,
    method: Literal["mean", "max", "min"],
):
    """Blend 8 images with mean, min or max.

    Args:
        image (ndarray): Input image.
        method (Literal["mean", "max", "min"]): Blend method.

    Returns:
        ndarray: Blended image.
    """
    stack = cv2.merge((image1, image2, image3, image4, image5, image6, image7, image8))
    try:
        return getattr(np, method)(stack, axis=2).astype(np.uint8)
    except AttributeError:
        raise Exception("invalid blend method")
