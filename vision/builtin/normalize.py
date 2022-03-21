import cv2
import numpy as np


def main(image: np.ndarray, alpha, beta, norm_type, dtype=-1):
    return cv2.normalize(
        image, None, alpha=alpha, beta=beta, norm_type=norm_type, dtype=dtype
    )
