import cv2
import numpy as np


def main(image: np.ndarray, thresh: int, maxval: int, type: int):

    _, th = cv2.threshold(image, thresh, maxval, type)
    return th
