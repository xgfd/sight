import cv2


def main(image: object, alpha=1, beta=0):
    return cv2.convertScaleAbs(image, alpha=alpha, beta=beta)
