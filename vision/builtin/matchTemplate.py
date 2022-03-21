import cv2
import numpy as np


def main(image: np.ndarray, template: np.ndarray, method):
    return cv2.matchTemplate(image, template, method)
