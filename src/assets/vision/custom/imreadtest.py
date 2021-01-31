from typing import Literal
import cv2

IMREAD = Literal[cv2.IMREAD_COLOR, cv2.IMREAD_GRAYSCALE, cv2.IMREAD_UNCHANGED]


def main(img: str, mode: IMREAD = cv2.IMREAD_UNCHANGED):
    return cv2.imread(img, mode)
