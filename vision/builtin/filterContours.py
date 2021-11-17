from typing import Tuple, List
import cv2
import numpy as np

from . import Contour


def main(
    image: object,
    _contours: List[Contour],
    _hierarchy: List[Tuple[int, int, int, int]],
    area_range: Tuple[float, float],
    bound_area_range: Tuple[float, float],
    length_range: Tuple[float, float],
    arclength_range: Tuple[float, float],
    aspect_range: Tuple[float, float],
    straightness_range: Tuple[float, float],
    line_thickness,
    return_image_mode,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, List[Contour], List[Tuple[int, int, int, int]]]:

    area_l, area_h = area_range
    bound_area_l, bound_area_h = bound_area_range
    length_l, length_h = length_range
    arclength_l, arclength_h = arclength_range
    aspect_l, aspect_h = aspect_range
    straightness_l, straightness_h = straightness_range

    selected_contours = []
    hierarchy_index = []

    for i, cont in enumerate(_contours):
        # area filter
        area = cv2.contourArea(cont)
        if not (area_l <= area <= area_h):
            continue

        # arc length filter
        arclength = cv2.arcLength(cont, closed=True)
        if not (arclength_l <= arclength <= arclength_h):
            continue

        # min area rectangle related filters
        _, (rw, rh), _ = cv2.minAreaRect(cont)
        length, width = (rw, rh) if rw > rh else (rh, rw)

        if not (length_l <= length <= length_h):
            continue

        bound_area = rw * rh
        if not (bound_area_l <= bound_area <= bound_area_h):
            continue

        aspect = width / (length + 1e-5)
        if not (aspect_l <= aspect <= aspect_h):
            continue

        # approximated reciprocal sinuosity as straightness
        straightness = 2 * length / (arclength + 1e-5)
        if not (straightness_l <= straightness <= straightness_h):
            continue

        selected_contours.append(cont)
        hierarchy_index.append(i)

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

    if _hierarchy is None:
        _hierarchy = np.array([[[]]])

    return ret_image, selected_contours, _hierarchy[:, hierarchy_index, :]
