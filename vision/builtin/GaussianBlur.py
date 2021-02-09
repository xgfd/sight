import cv2


def main(
    image: object,
    ksize_h: int,
    ksize_w: int,
    sigmaX: int,
    sigmaY: int,
    borderType: int,
):

    blur = cv2.GaussianBlur(
        image, (ksize_h, ksize_w), sigmaX=sigmaX, sigmaY=sigmaY, borderType=borderType
    )
    return blur
