from typing import Tuple

import cv2
import numpy as np

from . import Circle, Contour


def main(
    image: object,
    _contour: Contour,
    distanceType: int,
    maskSize: int,
    line_thickness: int,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, Circle]:

    shape_image = np.zeros_like(image)
    cv2.drawContours(shape_image, [_contour], -1, 255, -1)

    dist = cv2.distanceTransform(
        shape_image, distanceType=distanceType, maskSize=maskSize
    )
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
