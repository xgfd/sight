import cv2


def main(image: object, scale_x: float, scale_y: float, interpolation):
    return cv2.resize(image, None, fx=scale_x, fy=scale_y, interpolation=interpolation)
