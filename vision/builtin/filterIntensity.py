from typing import Tuple, List
import cv2
import numpy as np

from . import Contour


def main(
    _: object,
    image1: object,
    _contours: List[Contour],
    _hierarchy: List[Tuple[int, int, int, int]],
    int_mean_range: Tuple[float, float],
    int_std_range: Tuple[float, float],
    int_min_range: Tuple[float, float],
    int_max_range: Tuple[float, float],
    line_thickness,
    return_image_mode,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, List[Contour], List[Tuple[int, int, int, int]]]:

    selected_contours = []
    hierarchy_index = []

    region_mask = np.zeros_like(image1, dtype=np.uint8)
    cv2.drawContours(region_mask, _contours, -1, 255, -1)

    for i, cont in enumerate(_contours):
        rect = cv2.boundingRect(cont)
        region = _roi(image1, rect)
        mask = _roi(region_mask, rect)

        [[[mean]], [[std]]] = cv2.meanStdDev(region, mask=mask)
        if not _inrange(mean, int_mean_range) or not _inrange(std, int_std_range):
            continue

        min_int, max_int, _, _ = cv2.minMaxLoc(region, mask=mask)
        if not _inrange(min_int, int_min_range) or not _inrange(max_int, int_max_range):
            continue

        selected_contours.append(cont)
        hierarchy_index.append(i)

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image1, cv2.COLOR_GRAY2BGR)
        cv2.drawContours(
            ret_image, selected_contours, -1, (255, 255, 0), line_thickness
        )
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image1)
        cv2.drawContours(ret_image, selected_contours, -1, 255, line_thickness)
    else:
        # pass on the input image
        ret_image = image1

    if _hierarchy is None:
        _hierarchy = np.array([[[]]])

    return ret_image, selected_contours, _hierarchy[:, hierarchy_index, :]


def _roi(image, rect):
    x, y, w, h = rect
    return image[y : y + h, x : x + w]


def _inrange(v, range):
    low, high = range
    return low <= v <= high
