from typing import List, Literal, Tuple

import cv2
import numpy as np
from sklearn.cluster import AgglomerativeClustering

from . import Contour

# colours in B,G,R order
# fmt: off
palette = [(3, 189, 66), (177, 235, 30), (255, 27, 28), (255, 0, 110), (255, 127, 17), (131, 56, 236), (58, 134, 255), (190, 183, 164), (250, 188, 42), (177, 202, 255), (104, 141, 243), (77, 108, 238), (142, 111, 247), (201, 186, 242), (190, 216, 127), (73, 82, 59), (114, 152, 81), (171, 134, 46), (114, 59, 162), (1, 143, 241), (29, 62, 199), (115, 95, 0), (150, 147, 10), (189, 210, 148), (166, 216, 233), (0, 155, 238), (2, 103, 202), (3, 62, 187), (18, 32, 174), (38, 34, 155)]


def main(
    image: object,
    _contours: List[Contour],
    _: List[Tuple[int, int, int, int]],
    linkage: Literal["ward", "complete", "average", "single"],
    distance_threshold: float,
    line_thickness,
    return_image_mode,  # controls what image to return 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image
) -> Tuple[object, List[Contour], List[Tuple[int, int, int, int]]]:

    contour_centres = [
        (x + w / 2, y + h / 2)
        for (x, y, w, h) in (cv2.boundingRect(cont) for cont in _contours)
    ]

    clusters = AgglomerativeClustering(
        n_clusters=None, linkage=linkage, distance_threshold=distance_threshold
    ).fit(contour_centres)

    if return_image_mode == 0:
        # colour image with shape overlay
        ret_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        for i, cont in enumerate(_contours):
            colour = palette[clusters.labels_[i] % len(palette)]
            cv2.drawContours(ret_image, [cont], -1, colour, line_thickness)
    elif return_image_mode == 1:
        # shape on black background
        ret_image = np.zeros_like(image)
        cv2.drawContours(ret_image, _contours, -1, 255, line_thickness)
    else:
        # pass on the input image
        ret_image = image

    return ret_image, clusters
