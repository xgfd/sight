from typing import Literal

import cv2
import numpy as np


def main(
    image: np.ndarray,
    filter: Literal["Gaussian", "box", "median", "max", "min"],
    ksize: int,
    diff_mode: Literal["subtract", "divide", "bitwise_and"],
):
    """Generalised highpass filter.

    Args:
        image (np.ndarray): Input image.
        filter (Literal["Gaussian", "box", "median", "max", "min"]): Filter type.
        ksize (int): Kernel size.
        diff_mode (Literal["subtract", "divide", "bitwise_and"]): Difference method.

    Returns:
        np.ndarray: Highpass image.
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
        highpass_img = cv2.subtract(image, blur, dtype=dtype)
        highpass_img = cv2.add(highpass_img, 128, dtype=cv2.CV_8U)
    elif diff_mode == "divide":
        dtype = cv2.CV_64F
        highpass_img = cv2.divide(image, blur, dtype=dtype)
        highpass_img = cv2.multiply(highpass_img, 128, dtype=cv2.CV_8U)
    elif diff_mode == "bitwise_and":
        highpass_img = cv2.bitwise_and(image, blur)
    else:
        raise Exception("Unsupported diff mode")

    return highpass_img
