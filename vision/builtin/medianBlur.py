import cv2
import numpy as np


def main(image: np.ndarray, ksize: int):

    blur = cv2.medianBlur(image, ksize)
    return blur
