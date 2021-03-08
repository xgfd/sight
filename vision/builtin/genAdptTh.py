from typing import Literal

import cv2
import numpy as np


def main(
    image: object,
    filter: Literal["Gaussian", "box", "median", "max", "min"],
    ksize: int,
    diff_mode: Literal["subtract", "divide", "bitwise_and"],
    th_perct: float,
    th_type=cv2.THRESH_BINARY,
):
    """Generalised adaptive threshold.

    Args:
        image (object): Input image.
        filter (Literal["Gaussian", "box", "median", "max", "min"]): Filter type.
        ksize (int): Kernel size.
        diff_mode (Literal["subtract", "divide", "bitwise_and"]): Difference method.
        th_perct (float): Percentile between the min and max intensity of the diff image.
        th_type (int, optional): Threshold type. Defaults to cv2.THRESH_BINARY.

    Returns:
        object: Threshheld image.
    """
    if filter == "Gaussian":
        blur = cv2.GaussianBlur(image, (ksize, ksize), 0)
    elif filter == "box":
        blur = cv2.blur(image, (ksize, ksize))
    elif filter == "median":
        blur = cv2.medianBlur(image, ksize)
    elif filter == "max":
        kernel = np.ones((ksize, ksize), dtype=np.uint8)
        blur = cv2.dilate(image, kernel)
    elif filter == "min":
        kernel = np.ones((ksize, ksize), dtype=np.uint8)
        blur = cv2.erode(image, kernel)
    else:
        raise Exception("Unsupported filter type")

    if diff_mode == "subtract":
        dtype = cv2.CV_16S
        diff_img = cv2.subtract(image, blur, dtype=dtype)
    elif diff_mode == "divide":
        dtype = cv2.CV_64F
        diff_img = cv2.divide(image, blur, dtype=dtype)
    elif diff_mode == "bitwise_and":
        diff_img = cv2.bitwise_and(image, blur)
    else:
        raise Exception("Unsupported diff mode")

    del_min = np.min(diff_img)
    del_max = np.max(diff_img)
    threshold = del_min + (del_max - del_min) * th_perct

    _, th = cv2.threshold(diff_img, threshold, 255, th_type)
    return np.uint8(th)
