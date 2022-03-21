import cv2
import numpy as np


def main(
    image: np.ndarray,
    maxValue: int,
    adaptiveMethod: int,
    thresholdType: int,
    blockSize: int,
    C: int,
):

    th = cv2.adaptiveThreshold(
        image, maxValue, adaptiveMethod, thresholdType, blockSize, C
    )
    return th
