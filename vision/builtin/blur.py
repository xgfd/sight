import cv2
import numpy as np


def main(
    image: np.ndarray,
    ksize_h: int,
    ksize_w: int,
    borderType: int,
):

    blur = cv2.blur(image, (ksize_h, ksize_w), borderType=borderType)
    return blur
