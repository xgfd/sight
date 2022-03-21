import cv2
import numpy as np


def main(image: np.ndarray, code: int):
    return cv2.cvtColor(image, code)
