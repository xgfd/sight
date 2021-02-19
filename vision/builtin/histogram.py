import io
from typing import List, Tuple

import cv2
import matplotlib.pyplot as plt
import numpy as np


def main(image: object, show_hist=True) -> Tuple[object, List[List[Tuple[int]]]]:
    ret_image = image
    histogram = []

    is_colour = len(image.shape) == 3
    n_channel = 3 if is_colour else 1

    for i in range(n_channel):
        channel_hist = cv2.calcHist([image], [i], None, [256], [0, 256])
        histogram.append(channel_hist)

    if show_hist:
        colours = ("#3a86ff", "#06D6A0", "#EF476F") if is_colour else ("#577590",)
        x = range(256)
        for i, hist in enumerate(histogram):
            plt.fill_between(x, hist.ravel(), 0, alpha=0.3, color=colours[i], aa=True)
        plt.xlim(0, 255)
        buf = io.BytesIO()
        plt.savefig(buf, format="png", dpi=200)
        plt.close()

        buf.seek(0)
        img_arr = np.frombuffer(buf.getvalue(), dtype=np.uint8)
        buf.close()
        ret_image = cv2.imdecode(img_arr, 1)

    return ret_image, histogram
