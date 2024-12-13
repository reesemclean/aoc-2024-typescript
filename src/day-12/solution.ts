export const expectedPartOneSampleOutput = '1930';

export function solvePartOne(input: string): string {
  const grid = input.split('\n').map((line) => line.split(''));

  const accountedForPositions: Set<string> = new Set();
  const regions: { area: number; perimeter: number }[] = [];

  for (let y = 0; y < grid.length; y++) {
    // for (let y = 0; y < 1; y++) {
    //   for (let x = 0; x < 1; x++) {
    for (let x = 0; x < grid[y].length; x++) {
      const position = `${x},${y}`;

      if (accountedForPositions.has(position)) {
        continue;
      }

      const region = { area: 0, perimeter: 0 };

      const stack = [{ x, y }];
      const value = grid[y][x];

      while (stack.length > 0) {
        const position = stack.pop()!;
        console.log({ position: `${position.x},${position.y}` });

        if (accountedForPositions.has(`${position.x},${position.y}`)) {
          continue;
        }

        accountedForPositions.add(`${position.x},${position.y}`);
        region.area++;

        const above = grid[position.y - 1]?.[position.x];
        if (above === value) {
          if (!accountedForPositions.has(`${position.x},${position.y - 1}`)) {
            stack.push({ x: position.x, y: position.y - 1 });
          }
        } else {
          region.perimeter++;
        }

        const below = grid[position.y + 1]?.[position.x];
        if (below === value) {
          if (!accountedForPositions.has(`${position.x},${position.y + 1}`)) {
            stack.push({ x: position.x, y: position.y + 1 });
          }
        } else {
          region.perimeter++;
        }

        const left = grid[position.y]?.[position.x - 1];
        if (left === value) {
          if (!accountedForPositions.has(`${position.x - 1},${position.y}`)) {
            stack.push({ x: position.x - 1, y: position.y });
          }
        } else {
          region.perimeter++;
        }

        const right = grid[position.y]?.[position.x + 1];
        if (right === value) {
          if (!accountedForPositions.has(`${position.x + 1},${position.y}`)) {
            stack.push({ x: position.x + 1, y: position.y });
          }
        } else {
          region.perimeter++;
        }

        console.log({ endStack: stack.map((p) => `${p.x},${p.y}`) });
      }

      regions.push(region);
    }
  }

  return regions
    .reduce((acc, region) => acc + region.area * region.perimeter, 0)
    .toString();
}

export const expectedPartTwoSampleOutput = '1206';

export function solvePartTwo(input: string): string {
  const grid = input.split('\n').map((line) => line.split(''));

  const accountedForPositions: Set<string> = new Set();
  const regions: {
    x: number;
    y: number;
    left: boolean;
    top: boolean;
    bottom: boolean;
    right: boolean;
    value: string;
  }[][] = [];

  for (let y = 0; y < grid.length; y++) {
    // for (let y = 0; y < 1; y++) {
    //   for (let x = 0; x < 1; x++) {
    for (let x = 0; x < grid[y].length; x++) {
      const position = `${x},${y}`;

      if (accountedForPositions.has(position)) {
        continue;
      }

      const region: {
        x: number;
        y: number;
        left: boolean;
        top: boolean;
        bottom: boolean;
        right: boolean;
        value: string;
      }[] = [];

      const stack = [{ x, y }];
      const value = grid[y][x];

      while (stack.length > 0) {
        const position = stack.pop()!;

        if (accountedForPositions.has(`${position.x},${position.y}`)) {
          continue;
        }

        accountedForPositions.add(`${position.x},${position.y}`);
        const directions = { left: true, top: true, bottom: true, right: true };

        const above = grid[position.y - 1]?.[position.x];
        if (above === value) {
          if (!accountedForPositions.has(`${position.x},${position.y - 1}`)) {
            stack.push({ x: position.x, y: position.y - 1 });
          }
          directions.top = false;
        }

        const below = grid[position.y + 1]?.[position.x];
        if (below === value) {
          if (!accountedForPositions.has(`${position.x},${position.y + 1}`)) {
            stack.push({ x: position.x, y: position.y + 1 });
          }
          directions.bottom = false;
        }

        const left = grid[position.y]?.[position.x - 1];
        if (left === value) {
          if (!accountedForPositions.has(`${position.x - 1},${position.y}`)) {
            stack.push({ x: position.x - 1, y: position.y });
          }
          directions.left = false;
        }

        const right = grid[position.y]?.[position.x + 1];
        if (right === value) {
          if (!accountedForPositions.has(`${position.x + 1},${position.y}`)) {
            stack.push({ x: position.x + 1, y: position.y });
          }
          directions.right = false;
        }

        region.push({ ...position, ...directions, value });
      }

      regions.push(region);
    }
  }

  let totalPrice = 0;

  for (const region of regions) {
    const positionsSortedByX = [...region].sort(
      (a, b) => a.x - b.x || a.y - b.y,
    );
    const positionsSortedByY = [...region].sort(
      (a, b) => a.y - b.y || a.x - b.x,
    );

    const leftEdges = positionsSortedByX.filter((p) => p.left);

    let currentX = leftEdges[0].x;
    let currentY = leftEdges[0].y;

    let leftSides = 1;
    for (let i = 1; i < leftEdges.length; i++) {
      const position = leftEdges[i];
      if (position.x !== currentX || position.y !== currentY + 1) {
        leftSides++;
      }
      currentX = position.x;
      currentY = position.y;
    }

    const rightEdges = positionsSortedByX.filter((p) => p.right);
    currentX = rightEdges[0].x;
    currentY = rightEdges[0].y;
    let rightSides = 1;
    for (let i = 1; i < rightEdges.length; i++) {
      const position = rightEdges[i];
      if (position.x !== currentX || position.y !== currentY + 1) {
        rightSides++;
      }
      currentX = position.x;
      currentY = position.y;
    }

    const topEdges = positionsSortedByY.filter((p) => p.top);
    currentX = topEdges[0].x;
    currentY = topEdges[0].y;
    let topSides = 1;
    for (let i = 1; i < topEdges.length; i++) {
      const position = topEdges[i];
      if (position.y !== currentY || position.x !== currentX + 1) {
        topSides++;
      }
      currentX = position.x;
      currentY = position.y;
    }

    const bottomEdges = positionsSortedByY.filter((p) => p.bottom);
    currentX = bottomEdges[0].x;
    currentY = bottomEdges[0].y;
    let bottomSides = 1;
    for (let i = 1; i < bottomEdges.length; i++) {
      const position = bottomEdges[i];
      if (position.y !== currentY || position.x !== currentX + 1) {
        bottomSides++;
      }
      currentX = position.x;
      currentY = position.y;
    }

    const area = region.length;
    const sides = leftSides + rightSides + topSides + bottomSides;
    const price = area * sides;
    totalPrice += price;
    // console.log({ area, sides, price });
    // console.log({
    //   leftSides,
    //   rightSides,
    //   topSides,
    //   bottomSides,
    //   name: region[0].value,
    // });
  }

  return totalPrice.toString();
}
