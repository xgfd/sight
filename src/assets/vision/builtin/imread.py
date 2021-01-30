import json
from typing import Literal
import cv2

IMREAD = Literal[cv2.IMREAD_COLOR, cv2.IMREAD_GRAYSCALE, cv2.IMREAD_UNCHANGED]
# __controls__ = json.dumps(
#     [
#         {"type": "label", "name": "Read image"},
#         {
#             "type": "dropdown",
#             "bind": "mode",
#             "options": [
#                 {"name": "Unchanged", "value": cv2.IMREAD_UNCHANGED},
#                 {"name": "Grayscale", "value": cv2.IMREAD_GRAYSCALE},
#                 {"name": "Colour", "value": cv2.IMREAD_COLOR},
#             ],
#         },
#     ]
# )


def main(img: str, mode: IMREAD = cv2.IMREAD_UNCHANGED, context: dict = None):
    context = {} if context is None else context
    return cv2.imread(img, mode), context


__hash__ = "c1aaba0489810bfcdd2bd04693d72b6ab678f700cd592bce675268762d02c902"
