import cv2


def main(image: object, shape: int, ksize_h: int, ksize_w: int, op: int):

    kernel = cv2.getStructuringElement(shape, (ksize_h, ksize_w))
    morph = cv2.morphologyEx(image, op, kernel)
    return morph
