from typing import Tuple, Union
import cv2
import numpy as np


def main(
    image: object,
    thresholds: Tuple[int, int],
    ksize: Tuple[int, int],
    flag1: Union[int, str, bool],
    flag2: Union[int, str, bool],
):
    threshold1, threshold2 = thresholds
    canny_image = cv2.Canny(image, threshold1, threshold2, apertureSize=ksize[0])
    return canny_image
