import cv2


def main(image: object, image2: object, dtype: int):
    return cv2.subtract(image, image2, dtype=dtype)
