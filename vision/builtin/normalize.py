import cv2


def main(image: object, alpha, beta, norm_type, dtype=-1):
    cv2.normalize(
        image, image, alpha=alpha, beta=beta, norm_type=norm_type, dtype=dtype
    )
    return image
