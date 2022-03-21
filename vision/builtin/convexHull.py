from typing import Tuple, Union

import cv2
import numpy as np

from . import Contour


def main(
    image: np.ndarray,
    _contour: Contour,
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[np.ndarray, Union[Contour, None]]:

    try:
        hull = cv2.convexHull(_contour)
    except Exception:
        hull = None

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        if hull is not None:
            cv2.drawContours(
                ret_image, [hull], -1, (255, 255, 0), thickness=line_thickness
            )
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        if hull is not None:
            cv2.drawContours(ret_image, [hull], -1, 255, thickness=line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, hull
