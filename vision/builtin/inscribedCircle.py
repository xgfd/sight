from typing import Tuple
import cv2
import numpy as np

Circle = Tuple[Tuple[float, float], float]


def main(
    image: object,
    distanceType: int,
    maskSize: int,
    line_thickness: int,
    return_image_mode=3,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 3=pass on the input image
) -> Tuple[object, Circle]:
    dist = cv2.distanceTransform(image, distanceType=distanceType, maskSize=maskSize)
    _, radius, _, center = cv2.minMaxLoc(dist)
    radius = int(radius)

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        cv2.circle(ret_image, center, radius, (255, 255, 0), thickness=line_thickness)
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        cv2.circle(ret_image, center, radius, 255, thickness=line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, (center, radius)
