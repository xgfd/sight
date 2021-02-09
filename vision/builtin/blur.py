import cv2


def main(
    image: object,
    ksize_h: int,
    ksize_w: int,
    borderType: int,
):

    blur = cv2.blur(image, (ksize_h, ksize_w), borderType=borderType)
    return blur
