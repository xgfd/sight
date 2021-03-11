from typing import List, Tuple, Union, Literal

import cv2
import numpy as np

from . import Circle, Contour, Ellipse, Rectangle, RotatedRectangle, Shape


def _rect_to_points(rect: Rectangle):
    x, y, w, h = rect
    return (x, y), (x + w, y + h)


def _int_circle(circle: Circle):
    (x, y), radius = circle
    return (int(x), int(y)), int(radius)


def _draw_triangles(image, triangles, colour, thickness):
    cv2.drawContours(image, np.int0(triangles), -1, color=colour, thickness=thickness)


def _guess_shape(shapes: List[Shape]):
    if len(shapes) == 0:
        # just return any valid drawer for length-0 list
        return "ellipses"

    shape = shapes[0]
    elm0 = shape[0]

    try:
        elm00 = elm0[0]
        try:
            elm00[0]
            return "triangles" if len(shape) == 3 else "contours"
        except Exception:
            elm1 = shape[1]
            try:
                elm1[0]
                # either an ellipse or a rotated rect
                # ellipses should be explicitly specified
                return "rotated rectangles"
            except Exception:
                return "circles"
    except Exception:
        return "rectangles"


DRAWS = {
    "triangles": _draw_triangles,
    "rectangles": lambda image, rectangles, colour, thickness: [
        cv2.rectangle(image, *_rect_to_points(rect), color=colour, thickness=thickness)
        for rect in rectangles
    ],
    "rotated rectangles": lambda image, r_rectangles, colour, thickness: cv2.drawContours(
        image,
        [np.int0(cv2.boxPoints(tuple(rect))) for rect in r_rectangles],
        -1,
        color=colour,
        thickness=thickness,
    ),
    "ellipses": lambda image, ellipses, colour, thickness: [
        cv2.ellipse(image, tuple(ellipse), color=colour, thickness=thickness)
        for ellipse in ellipses
    ],
    "circles": lambda image, circles, colour, thickness: [
        cv2.circle(image, *_int_circle(circle), color=colour, thickness=thickness)
        for circle in circles
    ],
    "contours": lambda image, contours, colour, thickness: cv2.drawContours(
        image, contours, -1, color=colour, thickness=thickness
    ),
}


def main(
    _: object,
    image1: object,
    _shapes: List[Union[Contour, Circle, Rectangle, RotatedRectangle, Ellipse]],
    method: Literal[
        "auto", "ellipses", "contours", "rectangles", "circles", "rotated rectangles"
    ],
    colour: Tuple[int, int, int],
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, List[Shape]]:

    if method == "auto":
        method = _guess_shape(_shapes)

    draw = DRAWS[method]

    if return_image_mode == 0:
        # colour image with shape overlay
        if len(image1.shape) < 3:
            ret_image = cv2.cvtColor(image1, cv2.COLOR_GRAY2BGR)
        else:
            ret_image = image1
        draw(ret_image, _shapes, colour, line_thickness)
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image1)
        draw(ret_image, _shapes, colour, line_thickness)
    else:
        # pass on the input image
        ret_image = image1

    return ret_image, _shapes
