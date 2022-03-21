import cv2
import numpy as np


def main(
    image: np.ndarray,
    rotation: int,
):
    return cv2.rotate(image, rotation)
