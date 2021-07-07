import cv2


def main(image: object, shape: int, ksize_w: int, ksize_h: int, op: int):

    kernel = cv2.getStructuringElement(shape, (ksize_w, ksize_h))
    morph = cv2.morphologyEx(image, op, kernel)
    return morph
