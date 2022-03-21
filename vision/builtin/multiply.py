import cv2
import numpy as np


def main(image: np.ndarray, image2: np.ndarray, scale: int, dtype: int):
    return cv2.multiply(image, image2, scale=scale, dtype=dtype)
