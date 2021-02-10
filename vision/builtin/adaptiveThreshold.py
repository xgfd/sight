import cv2


def main(
    image: object,
    maxValue: int,
    adaptiveMethod: int,
    thresholdType: int,
    blockSize: int,
    C: int,
):

    th = cv2.adaptiveThreshold(
        image, maxValue, adaptiveMethod, thresholdType, blockSize, C
    )
    return th
