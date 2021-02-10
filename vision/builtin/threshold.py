import cv2


def main(image: object, thresh: int, maxval: int, type: int):

    _, th = cv2.threshold(image, thresh, maxval, type)
    return th
