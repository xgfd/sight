import cv2
import numpy as np


def main(image: np.ndarray, alpha=1, beta=0):
    return cv2.convertScaleAbs(image, alpha=alpha, beta=beta)
