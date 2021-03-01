import cv2


def main(image1: object, image2: object, alpha: float, beta: float, gamma: float):
    return cv2.addWeighted(image1, alpha, image2, beta, gamma)
