import cv2
import numpy as np


def main(image: object, filter_type: str):
    A_row = np.array([0.25, 0.5, 0.25], dtype=np.float32)
    A_col = np.array([[-1], [0], [1]], dtype=np.float32)
    B_row = np.array([-1, 0, 1], dtype=np.float32)
    B_col = np.array([[0.25], [0.5], [0.25]], dtype=np.float32)

    a = cv2.sepFilter2D(image, cv2.CV_32F, A_row, A_col)
    b = cv2.sepFilter2D(image, cv2.CV_32F, B_row, B_col)

    if filter_type == "sum_sqrt":
        ret = np.uint8(cv2.sqrt(cv2.add(cv2.pow(a, 2), cv2.pow(b, 2))))
    elif filter_type == "sum_abs":
        ret = cv2.add(cv2.absdiff(a, 0), cv2.absdiff(b, 0), dtype=cv2.CV_8U)
    elif filter_type == "x":
        ret = np.uint8(cv2.absdiff(b, 0))
    elif filter_type == "y":
        ret = np.uint8(cv2.absdiff(a, 0))
    else:
        raise ValueError("Invalid filter_type")

    return ret
