from typing import Tuple, List
import cv2
import numpy as np

from builtin import Contour, Circle


def main(
    image: object,
    _contours: List[Contour],
    line_thickness: int,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, List[Circle]]:

    circles: List[Circle] = []
    for cont in _contours:
        (x, y), radius = cv2.minEnclosingCircle(cont)

        center = (int(x), int(y))
        radius = int(radius)
        circles.append((center, radius))

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        for (center, radius) in circles:
            cv2.circle(
                ret_image, center, radius, (255, 255, 0), thickness=line_thickness
            )
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        for (center, radius) in circles:
            cv2.circle(ret_image, center, radius, 255, thickness=line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, circles
