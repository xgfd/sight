from pathlib import Path
import cv2


def main(filepath: str, flags: int):
    image = cv2.imread(str(Path(filepath).resolve()), flags=flags)
    return image
