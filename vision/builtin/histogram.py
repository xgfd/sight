import io
from typing import List, Tuple

import cv2
import matplotlib.pyplot as plt
import numpy as np


def main(image: object, show_hist=True) -> Tuple[object, List[List[Tuple[int]]]]:
    ret_image = image
    histogram = []

    is_colour = len(image.shape) == 3
    colours = ("#3a86ff", "#06D6A0", "#EF476F") if is_colour else ("#577590",)

    for i, col in enumerate(colours):
        channel_histr = cv2.calcHist([image], [i], None, [256], [0, 256])
        histogram.append(channel_histr)

        if show_hist:
            x = np.arange(256)
            h = np.zeros(256)
            plt.fill_between(
                x,
                channel_histr.ravel(),
                h,
                alpha=0.3,
                color=col,
                aa=True,
            )
            # plt.plot(
            #     channel_histr,
            #     alpha=0.3,
            #     color=col,
            #     aa=True,
            # )
            plt.xlim(0, 255)

    if show_hist:
        buf = io.BytesIO()
        plt.savefig(buf, format="png", dpi=200)
        plt.close()

        buf.seek(0)
        img_arr = np.frombuffer(buf.getvalue(), dtype=np.uint8)
        buf.close()
        ret_image = cv2.imdecode(img_arr, 1)

    return ret_image, histogram
