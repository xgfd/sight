import cv2
import numpy as np


def main(image: np.ndarray, image2: np.ndarray, dtype: int):
    return cv2.add(image, image2, dtype=dtype)
