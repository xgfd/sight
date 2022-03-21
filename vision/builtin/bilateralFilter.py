import cv2
import numpy as np


def main(
    image: np.ndarray,
    d: int,
    sigmaColor: int,
    sigmaSpace: bool,
    borderType: int,
):

    blur = cv2.bilateralFilter(image, d, sigmaColor, sigmaSpace, borderType=borderType)
    return blur
