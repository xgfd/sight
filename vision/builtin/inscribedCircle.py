import cv2
import numpy as np


def main(
    image: object,
    distanceType: int,
    maskSize: int,
    line_thickness: int,
    circle_only: False,
):
    dist = cv2.distanceTransform(image, distanceType=distanceType, maskSize=maskSize)
    _, radius, _, center = cv2.minMaxLoc(dist)
    radius = int(radius)
    if circle_only:
        ret_image = np.zeros_like(image)
        cv2.circle(ret_image, center, radius, 255, thickness=line_thickness)
    else:
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        cv2.circle(ret_image, center, radius, (255, 255, 0), thickness=line_thickness)

    return ret_image
