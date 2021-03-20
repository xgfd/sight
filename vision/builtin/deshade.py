import cv2


def main(image: object, ksize: int):
    blur = cv2.GaussianBlur(image, (ksize, ksize), 0)
    ret = cv2.multiply(cv2.divide(image, blur, dtype=cv2.CV_32F), 128, dtype=cv2.CV_8U)
    return ret
