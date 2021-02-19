from typing import Tuple, List, Union
from os.path import dirname, basename, isfile, join
import glob

Point1 = Tuple[float, float]
Point2 = Tuple[Tuple[float, float]]
Point = Union[Point1, Point2]
Circle = Tuple[Point1, float]
Triangle = Tuple[Point1, Point1, Point1]
Rectangle = Tuple[int, int, int, int]
RotatedRectangle = Tuple[Point1, Tuple[float, float], float]
Ellipse = RotatedRectangle
Contour = List[Point2]
Shape = Union[Triangle, Circle, Rectangle, RotatedRectangle, Ellipse, Contour]

modules = glob.glob(join(dirname(__file__), "*.py"))
__all__ = [
    basename(f)[:-3] for f in modules if isfile(f) and not basename(f).startswith("__")
]
