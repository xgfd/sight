import cv2
import numpy as np


def main(image: np.ndarray, sp: int, sr: int, max_level: int):
    return cv2.pyrMeanShiftFiltering(image, sp, sr, maxLevel=max_level)
