import cv2


def main(image: object, ksize: int):

    blur = cv2.medianBlur(image, ksize)
    return blur
