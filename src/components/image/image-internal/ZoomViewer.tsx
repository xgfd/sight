/* eslint react/require-default-props: "off" */
import { RectClipPath } from '@visx/clip-path';
import { localPoint } from '@visx/event';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Zoom } from '@visx/zoom';
import { ProvidedZoom, TransformMatrix } from '@visx/zoom/lib/types';
import React, { useState } from 'react';
import styles from './ZoomViewer.module.css';

// the current image on display
// cannot use a state since it contains Uint8ClampedArray
// and will cause infinite updates
let currentImageData: ImageData;

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
function loadImageData(
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
      const { naturalWidth: width, naturalHeight: height } = image;
      canvas.height = height;
      canvas.width = width;
      ctx.drawImage(image, 0, 0);
      currentImageData = ctx.getImageData(0, 0, width, height);
      setCanvas(canvas);
      setSrc(src);
    };
  }
}

function mouseLayer(
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
  const { width = viewWidth, height = viewHeight } = image;
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
    // image is centred so the offset is half of the height diff
    vx0 = 0;
    vy0 = -(viewHeight * view2ImgRatio - height) / 2;
  }

  return { x: vx0, y: vy0, width: vw, height: vh, ratio: view2ImgRatio };
}

function getColorIndicesForCoord(x: number, y: number, width: number) {
  const red = y * (width * 4) + x * 4;
  // [r,g,b,a]
  return [red, red + 1, red + 2, red + 3];
}

function intensityLayer(
  viewPort: {
    x: number;
    y: number;
    width: number;
    height: number;
    ratio: number;
  },
  zoom: ProvidedZoom & ZoomState,
  image: ImageData
) {
  const intensities = [];
  if (image !== undefined) {
    const { width, height } = image;
    const scale = zoom.transformMatrix.scaleX; // scaleX==scaleY
    // adjust for device resolution, convert to image coordinate system and compensate scaling to keep font and line height invariant on different devices, image sizes and scaling
    const fontSize = (6 * window.devicePixelRatio * viewPort.ratio) / scale;
    const strokeWidth =
      (0.2 * window.devicePixelRatio * viewPort.ratio) / scale;
    const strokeColour = '#7F7F7F'; // gray
    // display intensities when all texts fit into 0.9 pixel
    const zoomedInEnough = 3 * fontSize < 0.9;
    if (zoomedInEnough) {
      // calculate the top-left and bottom-right corners of the viewport in the image coordinate system
      const viewPortTopLeft = zoom.applyInverseToPoint({
        x: viewPort.x,
        y: viewPort.y,
      });
      const viewPortBottomRight = zoom.applyInverseToPoint({
        x: viewPort.x + viewPort.width,
        y: viewPort.y + viewPort.height,
      });
      // top-left and bottom-right of visible image area
      // it is the intersection of the image and the viewport
      const x0 = Math.max(0, Math.floor(viewPortTopLeft.x));
      const y0 = Math.max(0, Math.floor(viewPortTopLeft.y));
      const xn = Math.min(width - 1, Math.floor(viewPortBottomRight.x));
      const yn = Math.min(height - 1, Math.floor(viewPortBottomRight.y));
      const pixels = image.data;
      // pixel grid horizontal lines
      for (let y = y0; y <= yn; y += 1) {
        intensities.push(
          <line
            x1={x0}
            y1={y}
            x2={xn + 1}
            y2={y}
            stroke={strokeColour}
            strokeWidth={strokeWidth}
          />
        );
      }
      // pixel grid vertical lines
      for (let x = x0; x <= xn; x += 1) {
        intensities.push(
          <line
            x1={x}
            y1={y0}
            x2={x}
            y2={yn + 1}
            stroke={strokeColour}
            strokeWidth={strokeWidth}
          />
        );
      }
      // pixel intensity values
      for (let y = y0; y <= yn; y += 1) {
        for (let x = x0; x <= xn; x += 1) {
          const colorIndices = getColorIndicesForCoord(x, y, width);
          const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
          intensities.push(
            <g key={`${x},${y}`}>
              <text
                x={x + 0.5}
                y={y + 0.5 - fontSize}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  font: `${fontSize}px monospace`,
                  fill: 'red',
                }}
              >
                {pixels[redIndex]}
              </text>
              <text
                x={x + 0.5}
                y={y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  font: `${fontSize}px monospace`,
                  fill: 'green',
                }}
              >
                {pixels[greenIndex]}
              </text>
              <text
                x={x + 0.5}
                y={y + 0.5 + fontSize}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  font: `${fontSize}px monospace`,
                  fill: 'blue',
                }}
              >
                {pixels[blueIndex]}
              </text>
            </g>
          );
        }
      }
    }
  }
  return intensities;
}

export type { ProvidedZoom, ZoomState };

export default function ZoomViewer({
  imgSrc,
  className,
  initialTransform,
  background = 'transparent',
  exposeZoom,
}: {
  imgSrc: string;
  className?: string;
  initialTransform?: Transform;
  background?: string;
  exposeZoom: (z: ProvidedZoom & ZoomState) => void;
}) {
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);
  const [src, setSrc] = useState<string>('');
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(
    document.createElement<'canvas'>('canvas')
  );
  loadImageData(imgSrc, canvas, setSrc, setCanvas);
  return (
    <ParentSize>
      {({ width: viewWidth, height: viewHeight }) => {
        if (viewHeight * viewWidth === 0) {
          return undefined;
        }
        const viewPort = viewPortRect(viewWidth, viewHeight, canvas);
        const { width, height } = canvas;
        // 1 image pixel scale to 30 css pixel at most
        // 1 css pixel is converted to physical pixels then to pixels in the image coordinate system
        const maxScale = 30 * window.devicePixelRatio * viewPort.ratio;

        return (
          <Zoom
            className={className}
            style={{ pointerEvents: 'auto' }}
            width={width}
            height={height}
            scaleXMin={0.9}
            scaleXMax={maxScale}
            scaleYMin={0.9}
            scaleYMax={maxScale}
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
                    <rect
                      x={viewPort.x}
                      y={viewPort.y}
                      width={viewPort.width}
                      height={viewPort.height}
                      rx={0}
                      fill={background}
                    />
                    <g width="100%" height="100%" transform={zoom.toString()}>
                      <image imageRendering="pixelated" href={imgSrc} />
                      {intensityLayer(viewPort, zoom, currentImageData)}
                    </g>
                    {mouseLayer(viewPort, zoom)}
                    {showMiniMap && (
                      <g
                        clipPath="url(#zoom-clip)"
                        transform={`scale(0.25) translate(${
                          (width + (viewPort.width - width) / 2) * 4 -
                          width -
                          60
                        }, ${
                          (height + (viewPort.height - height) / 2) * 4 -
                          height -
                          60
                        })`}
                      >
                        <rect width={width} height={height} fill="#1a1a1a" />
                        <image width={width} height={height} href={imgSrc} />
                        <rect
                          width={width}
                          height={height}
                          fill="white"
                          fillOpacity={0.2}
                          stroke="white"
                          strokeWidth={
                            2 * window.devicePixelRatio * viewPort.ratio
                          }
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
