import cv2


def main(image: object, image2: object):
    return cv2.bitwise_xor(image, image2)
