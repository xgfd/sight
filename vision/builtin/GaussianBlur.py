from typing import Tuple
import cv2


def main(
    image: object,
    k_height: int,
    k_width: int,
    sigmaX: int,
    sigmaY: int,
    borderType: int,
):

    blur = cv2.GaussianBlur(
        image, (k_height, k_width), sigmaX=sigmaX, sigmaY=sigmaY, borderType=borderType
    )
    return blur
