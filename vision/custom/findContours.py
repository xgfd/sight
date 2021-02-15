from typing import Tuple
import cv2
import numpy as np


def main(
    image: object,
    contour_mode: int,
    method: int,
    area_range: Tuple[float, float],
    bound_area_range: Tuple[float, float],
    length_range: Tuple[float, float],
    aspect_range: Tuple[float, float],
    intensity_range: Tuple[float, float],
    line_thickness=2,
    return_image_mode=3,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 3=pass on the input image
):
    contours, _ = cv2.findContours(image, mode=contour_mode, method=method)

    area_l, area_h = area_range
    bound_area_l, bound_area_h = bound_area_range
    length_l, length_h = length_range
    aspect_l, aspect_h = aspect_range

    selected_contours = []

    for cont in contours:
        area = cv2.contourArea(cont)
        _, (w, h), _ = cv2.minAreaRect(cont)
        bound_area = w * h
        length = max(w, h)
        width = min(w, h)
        if length == 0:
            continue
        aspect = width / length
        # TODO add intensity
        if (
            (area_l <= area <= area_h)
            and (bound_area_l <= bound_area <= bound_area_h)
            and (length_l <= length <= length_h)
            and (aspect_l <= aspect <= aspect_h)
        ):
            selected_contours.append(cont)

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        cv2.drawContours(
            ret_image, selected_contours, -1, (255, 255, 0), line_thickness
        )
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        cv2.drawContours(ret_image, selected_contours, -1, 255, line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, selected_contours
