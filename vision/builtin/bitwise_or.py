import cv2
import numpy as np


def main(image: np.ndarray, image2: np.ndarray):
    return cv2.bitwise_or(image, image2)
