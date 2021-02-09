import cv2


def main(
    image: object,
    d: int,
    sigmaColor: int,
    sigmaSpace: bool,
    borderType: int,
):

    blur = cv2.bilateralFilter(image, d, sigmaColor, sigmaSpace, borderType=borderType)
    return blur
