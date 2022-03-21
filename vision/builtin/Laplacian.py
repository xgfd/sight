import cv2
import numpy as np


def main(image: np.ndarray, depth: int, ksize: int, scale: float, delta: int):
    return cv2.Laplacian(image, ddepth=depth, ksize=ksize, scale=scale, delta=delta)
