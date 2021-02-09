from typing import Tuple
import cv2
import numpy as np


def main(
    image: object,
    thresholds: Tuple[int, int],
    ksize_h: int,
    ksize_w: int,
    int_arg1: int,
    int_arg2: int,
    str_arg: str,
    bool_arg: bool,
):
    threshold1, threshold2 = thresholds
    canny_image = cv2.Canny(image, threshold1, threshold2, apertureSize=ksize_h)
    return canny_image
