from typing import Tuple
import cv2
import numpy as np


def main(
    image: np.ndarray, thresholds: Tuple[int, int], apertureSize: int, L2gradient: bool
):
    threshold1, threshold2 = thresholds
    canny_image = cv2.Canny(
        image, threshold1, threshold2, apertureSize=apertureSize, L2gradient=L2gradient
    )
    return canny_image
