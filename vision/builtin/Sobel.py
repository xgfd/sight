import cv2
import numpy as np


def main(
    image: np.ndarray, depth: int, dx: int, dy: int, ksize: int, scale: float, delta: int
):
    return cv2.Sobel(
        image, ddepth=depth, dx=dx, dy=dy, ksize=ksize, scale=scale, delta=delta
    )
