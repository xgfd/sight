from pathlib import Path
from typing import Literal
import cv2

IMREAD = Literal[cv2.IMREAD_COLOR, cv2.IMREAD_GRAYSCALE, cv2.IMREAD_UNCHANGED]


def main(img: str, mode: IMREAD = cv2.IMREAD_UNCHANGED):
    image = cv2.imread(str(Path(img).resolve()), mode)
    return image
