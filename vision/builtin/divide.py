import cv2


def main(image: object, image2: object, scale: int, dtype: int):
    return cv2.divide(image, image2, scale=scale, dtype=dtype)
