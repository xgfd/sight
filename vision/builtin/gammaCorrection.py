import cv2
import numpy as np


def main(image: np.ndarray, gamma: float):
    look_up_table = np.empty((1, 256), np.uint8)
    for i in range(256):
        look_up_table[0, i] = np.clip(pow(i / 255.0, gamma) * 255.0, 0, 255)

    return cv2.LUT(image, look_up_table)
