from typing import Tuple, Literal
import cv2


def main(
    image: object,
    contour_mode: int,
    method: int,
    area_range: Tuple[int, int],
    bound_area_range: Tuple[int, int],
    length_range: Tuple[int, int],
    aspect_range: Tuple[float, float],
    intensity_range: Tuple[int, int],
    offset_x=0,
    offset_y=0,
    line_thickness=2,
    draw_on_original=False,
):
    if not draw_on_original:
        colour_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

    contours, _ = cv2.findContours(
        image, mode=contour_mode, method=method, offset=(offset_x, offset_y)
    )

    area_l, area_h = area_range
    aspect_l, aspect_h = aspect_range
    length_l, length_h = length_range
    bound_area_l, bound_area_h = bound_area_range

    selected = []

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
            (area_l < area <= area_h)
            and (bound_area_l < bound_area <= bound_area_h)
            and (length_l < length <= length_h)
            and (aspect_l < aspect <= aspect_h)
        ):
            selected.append(cont)
    if draw_on_original:
        cv2.drawContours(image, selected, -1, 255, line_thickness)
        ret_image = image
    else:
        cv2.drawContours(colour_image, selected, -1, (255, 255, 0), line_thickness)
        ret_image = colour_image

    return ret_image
