from typing import Tuple
import numpy as np
from skimage.feature import peak_local_max


def main(image: np.ndarray, peak_distance: int) -> Tuple[np.ndarray, np.ndarray]:
    """Find the local maxima in a region of 2 * min_distance + 1 in an image as coordinate list.

    Args:
        image (np.ndarray): Input image.
        peak_distance (int): The minimal distance between peaks.

    Returns:
        Tuple[np.ndarray, np.ndarray]: Local maxima image and coordinate list.
    """
    peak_idx = peak_local_max(image, min_distance=peak_distance)
    peak_img = np.zeros_like(image)
    peak_img[tuple(peak_idx.T)] = 255
    return peak_img, peak_idx
