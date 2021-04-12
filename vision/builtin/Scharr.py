import cv2


def main(image: object, depth: int, dx: int, dy: int, scale: float, delta: int):
    return cv2.Scharr(image, ddepth=depth, dx=dx, dy=dy, scale=scale, delta=delta)
