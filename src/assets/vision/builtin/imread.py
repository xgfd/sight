from pathlib import Path
import cv2


def main(img: str, mode: int = cv2.IMREAD_UNCHANGED):
    image = cv2.imread(str(Path(img).resolve()), mode)
    return image
