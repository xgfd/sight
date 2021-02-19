import glob
from os.path import basename, dirname, isfile, join
from typing import List, Tuple, Union

Point1 = Tuple[float, float]
Point2 = Tuple[Tuple[float, float]]
Point = Union[Point1, Point2]
Circle = Tuple[Point1, float]
RotatedRectangle = Tuple[Point1, Tuple[float, float], float]
Ellipse = RotatedRectangle
Contour = List[Point2]

modules = glob.glob(join(dirname(__file__), "*.py"))
__all__ = [
    basename(f)[:-3] for f in modules if isfile(f) and not basename(f).startswith("__")
]
