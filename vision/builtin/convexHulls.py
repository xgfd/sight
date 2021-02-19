from typing import List, Tuple

import cv2
import numpy as np

from . import Contour


def main(
    image: object,
    _contours: List[Contour],
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 3=pass on the input image
) -> Tuple[object, List[Contour]]:

    hulls: List[Contour] = []
    for cont in _contours:
        hull = cv2.convexHull(cont)

        hulls.append(hull)

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        cv2.drawContours(ret_image, hulls, -1, (255, 255, 0), thickness=line_thickness)
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        cv2.drawContours(ret_image, hulls, -1, 255, thickness=line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, hulls
