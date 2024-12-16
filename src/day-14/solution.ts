export const expectedPartOneSampleOutput = '12';

export function solvePartOne(input: string): string {
  const robots = input.split('\n').map((line) => {
    const [x, y, dx, dy] = line.match(/(-?\d+)/g)!.map(Number);
    return { x, y, dx, dy };
  });

  const spaceWidth = 101;
  const spaceHeight = 103;
  const seconds = 100;

  const robotEndPositions = robots.map((robot) => {
    const { x, y, dx, dy } = robot;

    const totalXDistance = dx * seconds;
    const totalYDistance = dy * seconds;

    const endXBeforeWrap = x + totalXDistance;
    const endYBeforeWrap = y + totalYDistance;

    let endX = endXBeforeWrap;
    let endY = endYBeforeWrap;

    if (endX >= 0) {
      endX = endX % spaceWidth;
    } else {
      endX = spaceWidth - 1 + ((endX + 1) % spaceWidth);
    }

    if (endY >= 0) {
      endY = endY % spaceHeight;
    } else {
      endY = spaceHeight - 1 + ((endY + 1) % spaceHeight);
    }

    return { endX, endY };
  });

  const countsByQuadrant = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  };

  const midX = Math.floor(spaceWidth / 2);
  const midY = Math.floor(spaceHeight / 2);

  for (const position of robotEndPositions) {
    if (position.endX < midX && position.endY < midY) {
      countsByQuadrant.topLeft++;
    } else if (position.endX > midX && position.endY < midY) {
      countsByQuadrant.topRight++;
    } else if (position.endX < midX && position.endY > midY) {
      countsByQuadrant.bottomLeft++;
    } else if (position.endX > midX && position.endY > midY) {
      countsByQuadrant.bottomRight++;
    }
  }

  return (
    countsByQuadrant.topLeft *
    countsByQuadrant.topRight *
    countsByQuadrant.bottomLeft *
    countsByQuadrant.bottomRight
  ).toString();
}

export const expectedPartTwoSampleOutput = '';

export function solvePartTwo(input: string): string {
  const robots = input.split('\n').map((line) => {
    const [x, y, dx, dy] = line.match(/(-?\d+)/g)!.map(Number);
    return { x, y, dx, dy };
  });

  const spaceWidth = 101;
  const spaceHeight = 103;
  let seconds = 5000;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let isCandidate = false;

    const robotEndPositions = calculateEndPositions({
      robots,
      seconds,
      spaceHeight,
      spaceWidth,
    });

    const limitedDepth = 10;

    for (let y = 0; y < spaceHeight - limitedDepth; y++) {
      for (let x = 0; x < spaceWidth - limitedDepth; x++) {
        const isRobot = robotEndPositions.some(
          (position) => position.endX === x && position.endY === y,
        );
        if (!isRobot) {
          continue;
        }

        const check = checkChildren(x, y, robotEndPositions, limitedDepth);

        if (check) {
          isCandidate = true;
          break;
        }
      }
    }

    if (isCandidate) {
      console.log('Seconds:', seconds);
      const grid = generateGrid(robotEndPositions, spaceHeight, spaceWidth);
      for (const row of grid) {
        console.log(row.join(''));
      }
    }

    if (seconds % 100 === 0) {
      console.log('Seconds:', seconds);
    }

    seconds++;
  }

  // View output to check for image.
  return '';
}

function checkChildren(
  x: number,
  y: number,
  robotEndPositions: { endX: number; endY: number }[],
  depth: number,
) {
  if (depth === 0) {
    return true;
  }

  const next = { x: x + 1, y: y + 1 };

  if (
    robotEndPositions.some(
      (position) => position.endX === next.x && position.endY === next.y,
    )
  ) {
    return checkChildren(next.x, next.y, robotEndPositions, depth - 1);
  }

  return false;
}

function generateGrid(
  endPositions: { endX: number; endY: number }[],
  spaceHeight: number,
  spaceWidth: number,
) {
  const grid = Array.from({ length: spaceHeight }, () =>
    Array.from({ length: spaceWidth }, () => '.'),
  );

  for (const position of endPositions) {
    grid[position.endY][position.endX] = '#';
  }

  return grid;
}

function calculateEndPositions({
  robots,
  seconds,
  spaceHeight,
  spaceWidth,
}: {
  robots: { x: number; y: number; dx: number; dy: number }[];
  seconds: number;
  spaceHeight: number;
  spaceWidth: number;
}) {
  return robots.map((robot) => {
    const { x, y, dx, dy } = robot;

    const totalXDistance = dx * seconds;
    const totalYDistance = dy * seconds;

    const endXBeforeWrap = x + totalXDistance;
    const endYBeforeWrap = y + totalYDistance;

    let endX = endXBeforeWrap;
    let endY = endYBeforeWrap;

    if (endX >= 0) {
      endX = endX % spaceWidth;
    } else {
      endX = spaceWidth - 1 + ((endX + 1) % spaceWidth);
    }

    if (endY >= 0) {
      endY = endY % spaceHeight;
    } else {
      endY = spaceHeight - 1 + ((endY + 1) % spaceHeight);
    }

    return { endX, endY };
  });
}

// ~10000 is too high
