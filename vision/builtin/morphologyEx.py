import cv2
import numpy as np


def main(image: np.ndarray, shape: int, ksize_w: int, ksize_h: int, op: int):

    kernel = cv2.getStructuringElement(shape, (ksize_w, ksize_h))
    morph = cv2.morphologyEx(image, op, kernel)
    return morph
