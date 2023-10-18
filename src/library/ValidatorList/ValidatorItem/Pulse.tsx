// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Pulse = ({ points: rawPoints }: any) => {
  rawPoints = [0.9, 0.7, 0.9, 0.2, 0, 0, 0.9];

  let points = [rawPoints[0] || 0];
  points = points.concat(rawPoints);
  points.push(rawPoints[rawPoints.length - 1] || 0);

  const totalSegments = points.length - 2;
  const vbWidth = 512;
  const vbHeight = 124;
  const xPadding = 5;
  const yPadding = 25;
  const xArea = vbWidth - 2 * xPadding;
  const yArea = vbHeight - 2 * yPadding;
  const xSegment = xArea / totalSegments;
  let xCursor = xPadding;

  const pointsCoords = points.map((point: number, index: number) => {
    const coord = {
      x: xCursor,
      y: vbHeight - yPadding - yArea * point,
    };

    if (index === 0 || index === points.length - 2) {
      xCursor += xSegment * 0.5;
    } else {
      xCursor += xSegment;
    }
    return coord;
  });

  const lineCoords = [];
  for (let i = 0; i <= pointsCoords.length - 1; i++) {
    lineCoords.push({
      x1: pointsCoords[i].x,
      y1: pointsCoords[i].y,
      x2: pointsCoords[i + 1]?.x || pointsCoords[i].x,
      y2: pointsCoords[i + 1]?.y || pointsCoords[i].y,
    });
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {lineCoords.map(({ x1 }, index) => {
        if (index === 0 || index === lineCoords.length - 1) {
          return <></>;
        }
        return (
          <line
            key={`grid_coord_${index}`}
            strokeWidth="3.75"
            stroke="var(--border-primary-color)"
            x1={x1}
            y1={0}
            x2={x1}
            y2={vbHeight}
          />
        );
      })}
      {lineCoords.map(({ x1, y1, x2, y2 }, index) => {
        const opacity =
          index === 0 || index === lineCoords.length - 2 ? 0.25 : 1;
        return (
          <line
            key={`line_coord_${index}`}
            strokeWidth={4.25}
            opacity={opacity}
            stroke="var(--accent-color-primary)"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        );
      })}
    </svg>
  );
};
