import cv2
import numpy as np


def main(image: np.ndarray, scale_x: float, scale_y: float, interpolation):
    return cv2.resize(image, None, fx=scale_x, fy=scale_y, interpolation=interpolation)
