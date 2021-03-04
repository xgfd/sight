from typing import Tuple, Union

import cv2
import numpy as np

from . import Circle


def main(
    image: object,
    _circle: Circle,
    radius_range: Tuple[int, int],
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, Union[Circle, None]]:
    try:
        (x, y), r = _circle
        r_low, r_high = radius_range
        circle = _circle if r_low <= r <= r_high else None
    except Exception:
        circle = None

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        if circle is not None:
            cv2.circle(
                ret_image,
                (int(x), int(y)),
                int(r),
                (255, 255, 0),
                line_thickness,
            )
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        if circle is not None:
            cv2.circle(
                ret_image,
                (int(x), int(y)),
                int(r),
                255,
                line_thickness,
            )
    else:
        # pass on the input image
        ret_image = image

    return ret_image, circle
