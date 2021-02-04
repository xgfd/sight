from typing import Tuple
import cv2


def main(
    image: object, thresholds: Tuple[int, int], apertureSize: int, L2gradient: bool
):
    threshold1, threshold2 = thresholds
    canny_image = cv2.Canny(
        image, threshold1, threshold2, apertureSize=apertureSize, L2gradient=L2gradient
    )
    return canny_image
