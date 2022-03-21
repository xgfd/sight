import cv2
import numpy as np


def main(image: np.ndarray, image2: object, dtype: int):
    return cv2.subtract(image, image2, dtype=dtype)
