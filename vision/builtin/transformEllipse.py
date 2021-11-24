from typing import Tuple, Union, List, Iterable

import cv2
import numpy as np

from . import Ellipse


def main(
    image: object,
    _ellipses: Union[Ellipse, List[Ellipse], None],
    scale: float,
    rotation: int,
    line_thickness=2,
    return_image_mode=1,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, Union[Ellipse, List[Ellipse], None]]:

    transformed: List[Ellipse] = []

    if _ellipses is None or len(_ellipses) == 0:
        # return the same value if _ellipses is None or an empty list
        ret_ellipses = _ellipses
    else:  # not None nor an empty list
        # single ellipse or a list of ellipses?
        is_single = not isinstance(_ellipses[0][0], Iterable)

        transformed = [
            _transform(ell, scale, rotation)
            for ell in ([_ellipses] if is_single else _ellipses)
        ]

        # ellipse(s) that will be returned
        ret_ellipses: Union[Ellipse, List[Ellipse], None] = (
            transformed[0] if is_single else transformed
        )

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        for ellipse in transformed:
            cv2.ellipse(ret_image, ellipse, (255, 255, 0), thickness=line_thickness)
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        for ellipse in transformed:
            cv2.ellipse(ret_image, ellipse, 255, thickness=line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, ret_ellipses


def _transform(ellipse: Ellipse, scale: float, rotation: float):
    center, (w, h), angle = ellipse
    return (center, (int(w * scale), int(h * scale)), angle + rotation)
