from typing import Tuple
import cv2


def main(image: object, thresholds: Tuple[int, int], ksize: int):
    threshold1, threshold2 = thresholds
    canny_image = cv2.Canny(image, threshold1, threshold2, apertureSize=ksize)
    return canny_image
