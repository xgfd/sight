from typing import Tuple
import cv2


def main(image: object, thresholds: Tuple[int, int]):
    threshold1, threshold2 = thresholds
    canny_image = cv2.inRange(image, threshold1, threshold2)
    return canny_image
