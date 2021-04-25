/* eslint react/require-default-props: "off" */
import { RectClipPath } from '@visx/clip-path';
import { localPoint } from '@visx/event';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Zoom } from '@visx/zoom';
import { ProvidedZoom, TransformMatrix } from '@visx/zoom/lib/types';
import React, { useState } from 'react';
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
  setSrc: React.Dispatch<React.SetStateAction<string>>,
  setCanvas: React.Dispatch<React.SetStateAction<HTMLCanvasElement>>
) {
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      // clear canvas before updating its dimension
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0);
      setCanvas(canvas);
      setSrc(src);
    };
  }
}

function createMouseLayer(
  viewPort: { x: number; y: number; width: number; height: number },
  zoom: ProvidedZoom & ZoomState
) {
  const { x, y, width, height } = viewPort;
  return (
    <rect
      style={{
        cursor: zoom.isDragging ? 'grabbing' : 'grab',
      }}
      x={x}
      y={y}
      width={width}
      height={height}
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
  );
}
/**
 * Get the view port rectangle in the image coordinate system.
 * @param viewWidth View port width.
 * @param viewHeight View port height.
 * @param image Image canvas.
 */
function viewPortRect(
  viewWidth: number,
  viewHeight: number,
  image: HTMLCanvasElement
) {
  // the image is scaled and centred to fit into the view port (the parent element in this case)
  // and doesn't necessarily cover the whole view port
  // we want the mouse layer (picks up scaling and panning) to cover
  // the whole parent element so need to shift and expand the mouse layer
  // the top-left corner of the view port inside the image coordinate system is the offsets for the mouse layer
  const { width, height } = image;
  const viewAsp = viewHeight / viewWidth;
  const imgAsp = height / width;
  // conversion ratio from view coordinates to image coordinates
  let view2ImgRatio;
  // in the image coordinate system, the coordinates of the origin of the view coordinate system
  let vx0;
  let vy0;
  // in the image coordinate system, the width and height of the origin of the view coordinate system
  let vw;
  let vh;
  // view is wider than the image
  if (viewAsp <= imgAsp) {
    view2ImgRatio = height / viewHeight;
    vw = viewWidth * view2ImgRatio;
    vh = height;
    // image is centred so the offset is half of the width diff
    vx0 = -(vw - width) / 2;
    vy0 = 0;
  } else {
    view2ImgRatio = width / viewWidth;
    vw = width;
    vh = viewHeight * view2ImgRatio;
    // image is centred so the offset is half of the width diff
    vx0 = 0;
    vy0 = (viewHeight * view2ImgRatio - height) / 2;
  }

  return { x: vx0, y: vy0, width: vw, height: vh };
}

function createIntensityLayer(
  viewPort: { x: number; y: number; width: number; height: number },
  zoom: ProvidedZoom & ZoomState,
  image: HTMLCanvasElement
) {
  const { width, height } = image;
  const scale = zoom.transformMatrix.scaleX; // scaleX==scaleY
  const lineHeight = Math.floor(16 * window.devicePixelRatio) / scale;
  const fontSize = Math.floor(14 * window.devicePixelRatio) / scale;
  const zoomedInEnough = 3 * lineHeight < 0.9;

  const viewPortTopLeft = zoom.applyInverseToPoint({
    x: viewPort.x,
    y: viewPort.y,
  });
  const viewPortBottomRight = zoom.applyInverseToPoint({
    x: viewPort.x + viewPort.width,
    y: viewPort.y + viewPort.height,
  });
  const x0 = Math.max(0, Math.floor(viewPortTopLeft.x));
  const y0 = Math.max(0, Math.floor(viewPortTopLeft.y));
  const xn = Math.min(width - 1, Math.floor(viewPortBottomRight.x));
  const yn = Math.min(height - 1, Math.floor(viewPortBottomRight.y));
  const intensities = [];
  if (zoomedInEnough) {
    const ctx = image.getContext('2d');
    if (ctx !== null) {
      const stride = xn - x0 + 1;
      for (let y = y0; y <= yn; y += 1) {
        for (let x = x0; x <= xn; x += 1) {
          const pixelIntensity = ctx.getImageData(x, y, 1, 1).data;
          // const pixelIntensity = pixelIntensities[y * stride + x];
          intensities.push(
            <g key={`${y * stride + x}`}>
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
  imgSrc,
  className,
  initialTransform,
  exposeZoom,
}: {
  imgSrc: string;
  className?: string;
  initialTransform?: Transform;
  exposeZoom: (z: ProvidedZoom) => void;
}) {
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);
  const [src, setSrc] = useState<string>('');
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(
    document.createElement<'canvas'>('canvas')
  );
  drawImage(imgSrc, canvas, setSrc, setCanvas);
  return (
    <ParentSize>
      {({ width: viewWidth, height: viewHeight }) => {
        const viewPort = viewPortRect(viewWidth, viewHeight, canvas);
        const { width, height } = canvas;

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

              return (
                <div>
                  <svg
                    width={viewWidth}
                    height={viewHeight}
                    viewBox={`0 0 ${width} ${height}`}
                  >
                    <RectClipPath id="zoom-clip" width="100%" height="100%" />
                    {/* <rect width="100%" height="100%" rx={0} fill={bg} /> */}
                    <g>
                      <image
                        imageRendering="pixelated"
                        transform={zoom.toString()}
                        href={imgSrc}
                      />
                      <g width="100%" height="100%" transform={zoom.toString()}>
                        {createIntensityLayer(viewPort, zoom, canvas)}
                      </g>
                    </g>
                    {createMouseLayer(viewPort, zoom)}
                    {showMiniMap && (
                      <g
                        clipPath="url(#zoom-clip)"
                        transform={`scale(0.25) translate(${
                          width * 4 - width - 60
                        }, ${height * 4 - height - 60})`}
                      >
                        <rect width={width} height={height} fill="#1a1a1a" />
                        <image width={width} height={height} href={imgSrc} />
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
