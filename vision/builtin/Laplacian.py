import cv2


def main(image: object, depth: int, ksize: int, scale: float, delta: int):
    return cv2.Laplacian(image, ddepth=depth, ksize=ksize, scale=scale, delta=delta)
