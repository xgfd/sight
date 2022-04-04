from typing import Literal, Tuple, Union

import cv2
import numpy as np

from . import Ellipse, RotatedRectangle

DRAWS = {
    "rectangle": lambda image, rect, colour, thickness: cv2.drawContours(
        image,
        [np.int0(cv2.boxPoints(tuple(rect)))],
        -1,
        color=colour,
        thickness=thickness,
    ),
    "ellipse": lambda image, ellipse, colour, thickness: cv2.ellipse(
        image, tuple(ellipse), color=colour, thickness=thickness
    ),
}


def main(
    _: np.ndarray,
    image: np.ndarray,
    shape: Literal["ellipse", "rectangle"],
    x: int,
    y: int,
    width: int,
    height: int,
    angle: float,
    colour: Tuple[int, int, int],
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image; 3=gray image with shape overlay
) -> Tuple[object, Union[Ellipse, RotatedRectangle]]:

    draw = DRAWS[shape]

    shape_data = ((x, y), (width, height), angle)

    if return_image_mode == 0:
        # colour image with shape overlay
        if len(image.shape) < 3:
            ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        else:
            ret_image = image
        draw(ret_image, shape_data, colour, line_thickness)
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        draw(ret_image, shape_data, colour, line_thickness)
    # 2 had been used to return the original image
    elif return_image_mode == 3:
        if len(image.shape) >= 3:
            ret_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            ret_image = image
        draw(ret_image, shape_data, colour, line_thickness)
    else:
        # pass on the input image by default
        ret_image = image

    return ret_image, shape_data
