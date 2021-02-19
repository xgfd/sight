from typing import Tuple

import cv2
import numpy as np

from . import Circle


def main(
    image: object,
    contour_mode: int,
    method: int,
    bound_area_range: Tuple[float, float],
    aspect: float,
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, Circle]:
    contours, _ = cv2.findContours(image, mode=contour_mode, method=method)

    bound_area_l, bound_area_h = bound_area_range

    selected = []

    for cont in contours:
        _, (w, h), _ = cv2.minAreaRect(cont)
        bound_area = w * h
        length = max(w, h)
        width = min(w, h)
        if length == 0:
            continue
        if (bound_area_l <= bound_area <= bound_area_h) and (
            aspect <= (width / length)
        ):
            selected.append(cont)
    if len(selected) > 0:
        selected.sort(key=lambda cont: cv2.boundingRect(cont)[2])
        centre, radius = cv2.minEnclosingCircle(selected[-1])
    else:
        centre, radius = (0, 0), 0

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        cv2.circle(
            ret_image,
            (int(centre[0]), int(centre[1])),
            int(radius),
            (255, 255, 0),
            line_thickness,
        )
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        cv2.circle(
            ret_image,
            (int(centre[0]), int(centre[1])),
            int(radius),
            255,
            line_thickness,
        )
    else:
        # pass on the input image
        ret_image = image

    return ret_image, (centre, radius)
