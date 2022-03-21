from typing import List, Tuple, Literal, Union

import cv2
import numpy as np
from . import Contour


def _minAreaRectArea(contour: Contour) -> float:
    _, (w, h), _ = cv2.minAreaRect(contour)
    return w * h


def _length(contour: Contour) -> float:
    _, (w, h), _ = cv2.minAreaRect(contour)
    return max(w, h)


def _aspect(contour: Contour) -> float:
    _, (w, h), _ = cv2.minAreaRect(contour)
    return min(w, h) / max(w, h)


FEATURES = {
    "contourArea": cv2.contourArea,
    "minAreaRect": _minAreaRectArea,
    "length": _length,
    "aspect": _aspect,
}


def main(
    image: np.ndarray,
    _contours: List[Contour],
    method: Literal["max", "min", "first", "last", "concatenate"],
    order_by: Literal["contourArea", "minAreaRect", "length", "aspect"],
    line_thickness=2,
    return_image_mode=1,
) -> Tuple[np.ndarray, Union[Contour, None]]:
    """Reduce contours to a single contour.

    Args:
        image (np.ndarray): Input image.
        _contours (List[Contour]): Contours to be reduced.
        method (Literal["max", "min", "first", "last"]): Which contour to return.
        sort_by (Literal["contourArea", "minAreaRect", "length", "aspect"]): If `method` is min or max, sort contours by the given feature.
        line_thickness (int, optional): Line thickness when drawing shapes. Defaults to 2.
        return_image_mode (int, optional): What image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image. Defaults to 1.

    Returns:
        Tuple[np.ndarray, Union[Contour, None]]: Return image; selected contour or None if _contours is empty.
    """

    if len(_contours) == 0:
        ret_contour = None
    else:
        if method == "first":
            ret_contour = _contours[0]

        if method == "last":
            ret_contour = _contours[-1]

        # ret_contour = eval(method)(_contours, key=FEATURES[sort_by])
        if method == "max":
            ret_contour = max(_contours, key=FEATURES[order_by])

        if method == "min":
            ret_contour = min(_contours, key=FEATURES[order_by])

        if method == "concatenate":
            ret_contour = np.concatenate(tuple(_contours), axis=0)

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        if ret_contour is not None:
            cv2.drawContours(
                ret_image, [ret_contour], -1, (255, 255, 0), line_thickness
            )
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        if ret_contour is not None:
            cv2.drawContours(ret_image, [ret_contour], -1, 255, line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, ret_contour
