from typing import Literal

from skimage.filters import frangi, hessian, meijering, sato


def main(
    image: object,
    sigmas=[1, 10, 2],
    black_ridges=True,
    method: Literal["meijering", "sato", "frangi", "hessian"] = "meijering",
):
    """Detect ridge-like structures, such as neurites, tubes, vessels, wrinkles or rivers. See https://scikit-image.org/docs/dev/auto_examples/edges/plot_ridge_filter.html#sphx-glr-auto-examples-edges-plot-ridge-filter-py for examples.

    Args:
        image (object): Input image.
        sigmas (Tuple[int, int, int], optional): Sigmas used as scales of filter given as a range tuple (start, end, step). Defaults to [1, 10, 2].
        black_ridges (bool, optional): Detects black ridges or white ridges. Defaults to True.
        method (Literal, optional): Specifies the ridge filter, one of "meijering", "sato", "frangi" or "hessian". Defaults to "meijering".
    """
    sigmas = range(*sigmas)
    if method == "meijering":
        return meijering(image, sigmas=sigmas, black_ridges=black_ridges)

    if method == "sato":
        return sato(image, sigmas=sigmas, black_ridges=black_ridges)

    if method == "frangi":
        return frangi(image, sigmas=sigmas, black_ridges=black_ridges)

    if method == "hessian":
        return hessian(image, sigmas=sigmas, black_ridges=black_ridges)

    raise ValueError(f"Unsupported ridge filter: {method}")
