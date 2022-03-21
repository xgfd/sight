import cv2
import numpy as np


def main(image: np.ndarray, depth: int, dx: int, dy: int, scale: float, delta: int):
    return cv2.Scharr(image, ddepth=depth, dx=dx, dy=dy, scale=scale, delta=delta)
