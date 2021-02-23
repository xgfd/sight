import cv2
import numpy as np


def main(filepath: str, flags: int):
    # use fromfile since imread doesn't handle utf8 well
    arr = np.fromfile(filepath, dtype=np.uint8)
    image = cv2.imdecode(arr, flags=flags)
    return image
