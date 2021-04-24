/* eslint react/require-default-props: "off" */
import { RectClipPath } from '@visx/clip-path';
import { localPoint } from '@visx/event';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Zoom } from '@visx/zoom';
import { ProvidedZoom, TransformMatrix } from '@visx/zoom/lib/types';
import React, { useState, useRef } from 'react';
import styles from './ZoomViewer.module.css';

const bg = '#0a0a0a';

interface Transform {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  skewX: number;
  skewY: number;
}

type ZoomState = {
  initialTransformMatrix: TransformMatrix;
  transformMatrix: TransformMatrix;
  isDragging: boolean;
};

/**
 * Create a canvas with a given image.
 * The context is used to read pixel intensities when the image viewer is zoomed in enough.
 * The image is drawn asynchronously after this function returns, but should be available when the canvas is actually used.
 * @param src Image URL.
 * @returns A canvas with the image drawn on it.
 */
function drawImage(
  src: string,
  canvas: HTMLCanvasElement,
  setImageSrc: React.Dispatch<React.SetStateAction<string>>
) {
  const ctx = canvas.getContext('2d');

  const image = new Image();
  image.src = src;
  image.onload = () => {
    if (ctx !== null) {
      // clear canvas before updating its dimension
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0);
    }
    setImageSrc(src);
  };
}

function createIntensityLayer(
  viewWidth: number,
  viewHeight: number,
  zoom: ProvidedZoom & ZoomState,
  imageCanvas: HTMLCanvasElement
) {
  const { width, height } = imageCanvas;
  const scale = zoom.transformMatrix.scaleX; // scaleX==scaleY
  const lineHeight = Math.floor(16 * window.devicePixelRatio) / scale;
  const fontSize = Math.floor(14 * window.devicePixelRatio) / scale;
  const zoomedInEnough = 3 * lineHeight < 0.9;

  const viewPortTopLeft = zoom.applyInverseToPoint({ x: 0, y: 0 });
  const viewPortBottomRight = zoom.applyInverseToPoint({ x: width, y: height });
  const x0 = Math.max(0, Math.floor(viewPortTopLeft.x));
  const y0 = Math.max(0, Math.floor(viewPortTopLeft.y));
  const xn = Math.min(width - 1, Math.floor(viewPortBottomRight.x));
  const yn = Math.min(height - 1, Math.floor(viewPortBottomRight.y));

  const intensities = [];
  if (zoomedInEnough) {
    const ctx = imageCanvas.getContext('2d');
    if (ctx !== null) {
      // const pixelIntensities = ctx.getImageData(x0, y0, 2, 2).data;
      // console.log(pixelIntensities);
      const stride = xn - x0 + 1;
      for (let y = y0; y <= yn; y += 1) {
        for (let x = x0; x <= xn; x += 1) {
          const pixelIntensity = ctx.getImageData(x, y, 1, 1).data;
          // const pixelIntensity = pixelIntensities[y * stride + x];
          intensities.push(
            <g key={y * stride + x}>
              <text
                x={x}
                y={y + fontSize}
                dx={8 / scale}
                dy={(1 - 3 * lineHeight) / 2}
                style={{
                  font: `${fontSize}px serif`,
                  fill: 'red',
                }}
              >
                {pixelIntensity[0]}
              </text>
              <text
                x={x}
                y={y + fontSize + lineHeight}
                dx={8 / scale}
                dy={(1 - 3 * lineHeight) / 2}
                style={{
                  font: `${fontSize}px serif`,
                  fill: 'green',
                }}
              >
                {pixelIntensity[1]}
              </text>
              <text
                x={x}
                y={y + fontSize + lineHeight * 2}
                dx={8 / scale}
                dy={(1 - 3 * lineHeight) / 2}
                style={{
                  font: `${fontSize}px serif`,
                  fill: 'blue',
                }}
              >
                {pixelIntensity[1]}
              </text>
            </g>
          );
        }
      }
    }
  }
  return intensities;
}

export { ProvidedZoom };

export default function ZoomViewer({
  imgRef,
  className,
  initialTransform,
  exposeZoom,
}: {
  imgRef: string;
  className?: string;
  initialTransform?: Transform;
  exposeZoom: (z: ProvidedZoom) => void;
}) {
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);
  const [srcUpdate, setSrcUpdate] = useState<string>(imgRef);
  const [imageCanvas, setImageCanvas] = useState<HTMLCanvasElement>(
    document.createElement<'canvas'>('canvas')
  );
  drawImage(imgRef, imageCanvas, setSrcUpdate);
  return (
    <ParentSize>
      {({ width: viewWidth, height: viewHeight }) => {
        const { width, height } = imageCanvas;
        return (
          <Zoom
            className={className}
            style={{ pointerEvents: 'auto' }}
            width={width}
            height={height}
            scaleXMin={0.8}
            scaleXMax={150}
            scaleYMin={0.8}
            scaleYMax={150}
            transformMatrix={initialTransform}
          >
            {(zoom) => {
              exposeZoom(zoom);
              const intensityTexts = createIntensityLayer(
                viewWidth,
                viewHeight,
                zoom,
                imageCanvas
              );

              return (
                <div>
                  <svg
                    width={viewWidth}
                    height={viewHeight}
                    viewBox={`0 0 ${width} ${height}`}
                  >
                    <RectClipPath id="zoom-clip" width="100%" height="100%" />
                    <rect width="100%" height="100%" rx={0} fill={bg} />
                    <g clipPath="url(#zoom-clip)">
                      <image
                        imageRendering="pixelated"
                        transform={zoom.toString()}
                        href={imgRef}
                      />
                      <g width="100%" height="100%" transform={zoom.toString()}>
                        {intensityTexts}
                      </g>
                    </g>
                    <rect
                      style={{
                        cursor: zoom.isDragging ? 'grabbing' : 'grab',
                      }}
                      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                      width="100%"
                      height="100%"
                      rx={0}
                      fill="transparent"
                      onTouchStart={zoom.dragStart}
                      onTouchMove={zoom.dragMove}
                      onTouchEnd={zoom.dragEnd}
                      onMouseDown={zoom.dragStart}
                      onMouseMove={zoom.dragMove}
                      onMouseUp={zoom.dragEnd}
                      onMouseLeave={() => {
                        if (zoom.isDragging) zoom.dragEnd();
                      }}
                      onDoubleClick={(event) => {
                        const point = localPoint(event) || { x: 0, y: 0 };
                        zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                      }}
                    />
                    {showMiniMap && (
                      <g
                        clipPath="url(#zoom-clip)"
                        transform={`scale(0.25) translate(${
                          width * 4 - width - 60
                        }, ${height * 4 - height - 60})`}
                      >
                        <rect width={width} height={height} fill="#1a1a1a" />
                        <image width={width} height={height} href={imgRef} />
                        <rect
                          width={width}
                          height={height}
                          fill="white"
                          fillOpacity={0.2}
                          stroke="white"
                          strokeWidth={4}
                          transform={zoom.toStringInvert()}
                        />
                      </g>
                    )}
                  </svg>
                  <div className={styles['mini-map']}>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={() => setShowMiniMap(!showMiniMap)}
                    >
                      {showMiniMap ? 'Hide' : 'Show'} Mini Map
                    </button>
                  </div>
                </div>
              );
            }}
          </Zoom>
        );
      }}
    </ParentSize>
  );
}
