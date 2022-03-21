from typing import Tuple, List
import cv2
import numpy as np

from . import Contour


def bounding_box_float(contour: Contour) -> Tuple[float, float, float, float]:
    x, y, w, h = cv2.boundingRect(contour)
    return np.array([x, y, x + w, y + h], dtype=np.float)


def main(
    image: np.ndarray,
    _contours: List[Contour],
    overlap_thresh: float,
    line_thickness=2,
    return_image_mode=1,
) -> Tuple[np.ndarray, List[Contour]]:
    """Non-maximum suppression for contours.

    The algorithm runs on the bounding boxes of contours to eliminate non-maximum overlapping contours.

    Args:
        image (np.ndarray): Input image.
        _contours (List[Contour]): A list of contours.
        overlap_thresh (float): Overlap threshold for contours' bounding boxes.
        line_thickness (int, optional): Line thickness for drawing shapes over the result image. Defaults to 2.
        return_image_mode (int, optional): Type of the result image: 0=colour image with shape overlay; 1=shape on black background; 2=pass on the input image.. Defaults to 1.

    Returns:
        np.ndarray, List[Contour]: An image and a list of maximum contours.
    """
    selected_contours = []

    if len(_contours) > 0:
        boxes = np.array([bounding_box_float(cont) for cont in _contours])
        # initialize the list of picked indexes
        # grab the coordinates of the bounding boxes
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 2]
        y2 = boxes[:, 3]
        # compute the area of the bounding boxes and sort the bounding
        # boxes by the bottom-right y-coordinate of the bounding box
        area = (x2 - x1 + 1) * (y2 - y1 + 1)
        idxs = np.argsort(y2)
        # keep looping while some indexes still remain in the indexes
        # list
        while len(idxs) > 0:
            # grab the last index in the indexes list and add the
            # index value to the list of picked indexes
            last = len(idxs) - 1
            i = idxs[last]
            selected_contours.append(_contours[i])
            # find the largest (x, y) coordinates for the start of
            # the bounding box and the smallest (x, y) coordinates
            # for the end of the bounding box
            xx1 = np.maximum(x1[i], x1[idxs[:last]])
            yy1 = np.maximum(y1[i], y1[idxs[:last]])
            xx2 = np.minimum(x2[i], x2[idxs[:last]])
            yy2 = np.minimum(y2[i], y2[idxs[:last]])
            # compute the width and height of the bounding box
            w = np.maximum(0, xx2 - xx1 + 1)
            h = np.maximum(0, yy2 - yy1 + 1)
            # compute the ratio of overlap
            overlap = (w * h) / area[idxs[:last]]
            # delete all indexes from the index list that have
            idxs = np.delete(
                idxs, np.concatenate(([last], np.where(overlap > overlap_thresh)[0]))
            )

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
