import cv2
import numpy as np


def main(
    image: np.ndarray,
    ksize_h: int,
    ksize_w: int,
    sigmaX: int,
    sigmaY: int,
    borderType: int,
):

    blur = cv2.GaussianBlur(
        image, (ksize_h, ksize_w), sigmaX=sigmaX, sigmaY=sigmaY, borderType=borderType
    )
    return blur
