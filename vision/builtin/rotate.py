import cv2


def main(
    image: object,
    rotation: int,
):
    return cv2.rotate(image, rotation)
