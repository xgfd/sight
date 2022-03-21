import cv2
import numpy as np


def main(image: np.ndarray, ksize: int):
    blur = cv2.blur(image, (ksize, ksize))
    ret = cv2.add(cv2.subtract(image, blur, dtype=cv2.CV_16S), 128, dtype=cv2.CV_8U)
    return ret
