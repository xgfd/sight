import cv2


def main(img: str, mode: int = cv2.IMREAD_UNCHANGED):
    return cv2.imread(img, mode)
