import cv2


def main(image: object, template: object, method):
    return cv2.matchTemplate(image, template, method)
