import cv2


def main(image: object, block_size: int, aperture_size: int, k: int, normalise: bool):
    ret_image = cv2.cornerHarris(image, block_size, aperture_size, k)
    if normalise:
        dst_norm = cv2.normalize(
            ret_image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX
        )
        ret_image = cv2.convertScaleAbs(dst_norm)
    return ret_image
