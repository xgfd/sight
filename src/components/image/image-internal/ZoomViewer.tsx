/* eslint react/require-default-props: "off" */
import { RectClipPath } from '@visx/clip-path';
import { localPoint } from '@visx/event';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Zoom } from '@visx/zoom';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import React, { useState } from 'react';

const bg = '#0a0a0a';

interface Transform {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  skewX: number;
  skewY: number;
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
  return (
    <ParentSize>
      {({ width, height }) => (
        <div className={className}>
          <Zoom
            style={{ pointerEvents: 'auto' }}
            width={width}
            height={height}
            scaleXMin={1 / 2}
            scaleXMax={100}
            scaleYMin={1 / 2}
            scaleYMax={100}
            transformMatrix={initialTransform}
          >
            {(zoom) => {
              exposeZoom(zoom);
              return (
                <div className="relative">
                  <svg
                    width={width}
                    height={height}
                    style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
                  >
                    <RectClipPath
                      id="zoom-clip"
                      width={width}
                      height={height}
                    />
                    <rect width={width} height={height} rx={0} fill={bg} />
                    <image
                      width={width}
                      height={height}
                      imageRendering="pixelated"
                      transform={zoom.toString()}
                      href={imgRef}
                    />
                    <rect
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
                    {showMiniMap && (
                      <g
                        clipPath="url(#zoom-clip)"
                        transform={`
                    scale(0.25)
                    translate(${width * 4 - width - 60}, ${
                          height * 4 - height - 60
                        })
                  `}
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
                  <div className="mini-map">
                    <button
                      type="button"
                      className="btn btn-lg"
                      onClick={() => setShowMiniMap(!showMiniMap)}
                    >
                      {showMiniMap ? 'Hide' : 'Show'} Mini Map
                    </button>
                  </div>
                </div>
              );
            }}
          </Zoom>
          <style>{`
        .btn {
          margin: 0;
          text-align: center;
          border: none;
          background: #2f2f2f;
          color: #888;
          padding: 0 4px;
          border-top: 1px solid #0a0a0a;
          outline:none;
        }
        .btn-lg {
          font-size: 12px;
          line-height: 1;
          padding: 4px;
        }
        .mini-map {
          position: absolute;
          bottom: 25px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
      `}</style>
        </div>
      )}
    </ParentSize>
  );
}
