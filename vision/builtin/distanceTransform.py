import cv2
import numpy as np


def main(image: np.ndarray, distanceType: int, maskSize: int, normalise: bool):
    dist = cv2.distanceTransform(image, distanceType=distanceType, maskSize=maskSize)
    if normalise:
        dist = cv2.normalize(dist, dist, 0, 255, cv2.NORM_MINMAX)
    return dist
