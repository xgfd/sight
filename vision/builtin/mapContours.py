from typing import Literal, List, Tuple
import cv2
import numpy as np

from . import Contour, Circle, Shape, Rectangle, Point1


def _minEnclosingCircleInt(contour: Contour) -> Circle:
    (x, y), radius = cv2.minEnclosingCircle(contour)
    return (int(x), int(y)), int(radius)


def _to_points(rect: Rectangle) -> Tuple[Point1, Point1]:
    x, y, w, h = rect
    return (x, y), (x + w, y + h)


def _draw_triangles(image, triangles, colour, thickness):
    cv2.drawContours(image, np.int0(triangles), -1, color=colour, thickness=thickness)


MAPPERS = {
    "minEnclosingTriangle": lambda contour: cv2.minEnclosingTriangle(contour)[1],
    "boundingRect": cv2.boundingRect,
    "minAreaRect": cv2.minAreaRect,
    "fitEllipse": cv2.fitEllipse,
    "minEnclosingCircle": _minEnclosingCircleInt,
    "convexHull": cv2.convexHull,
}

DRAWS = {
    "minEnclosingTriangle": _draw_triangles,
    "boundingRect": lambda image, rectangles, colour, thickness: [
        cv2.rectangle(image, *_to_points(rect), color=colour, thickness=thickness)
        for rect in rectangles
    ],
    "minAreaRect": lambda image, r_rectangles, colour, thickness: cv2.drawContours(
        image,
        [np.int0(cv2.boxPoints(rect)) for rect in r_rectangles],
        -1,
        color=colour,
        thickness=thickness,
    ),
    "fitEllipse": lambda image, ellipses, colour, thickness: [
        cv2.ellipse(image, ellipse, colour, thickness) for ellipse in ellipses
    ],
    "minEnclosingCircle": lambda image, circles, colour, thickness: [
        cv2.circle(image, *circle, color=colour, thickness=thickness)
        for circle in circles
    ],
    "convexHull": lambda image, hulls, colour, thickness: cv2.drawContours(
        image, hulls, -1, color=colour, thickness=thickness
    ),
}


def main(
    image: object,
    _contours: List[Contour],
    method: Literal[
        "boundingRect", "minAreaRect", "fitEllipse", "convexHull", "minEnclosingCircle"
    ],
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, List[Shape]]:

    shapes = list(map(MAPPERS[method], _contours))

    draw = DRAWS[method]

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        colour = (255, 255, 0)
        draw(ret_image, shapes, colour, line_thickness)
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        colour = 255
        draw(ret_image, shapes, colour, line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, shapes
