import cv2
import numpy as np


def main(
    image: np.ndarray,
    ksize_h: int,
    ksize_w: int,
    normalize: bool,
    borderType: int,
):

    blur = cv2.boxFilter(
        image, -1, (ksize_h, ksize_w), normalize=normalize, borderType=borderType
    )
    return blur
