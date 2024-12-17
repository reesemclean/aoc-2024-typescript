export const expectedPartOneSampleOutput = '7036';

export function solvePartOne(input: string): string {
  const map = parseMap(input);

  const unvisited = new Set<positionString>();
  const distances = new Map<positionString, number>();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      for (const direction of ['north', 'east', 'south', 'west'] as const) {
        unvisited.add(`${x},${y},${direction}`);
        distances.set(`${x},${y},${direction}`, Infinity);
      }
    }
  }

  const start = findStartPosition(map);
  const target = findEndPosition(map);
  distances.set(`${start.x},${start.y},east`, 0);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (unvisited.size === 0) {
      break;
    }

    const current = Array.from(unvisited).reduce((minNode, node) => {
      if (distances.get(node)! < distances.get(minNode)!) {
        return node;
      }
      return minNode;
    });

    if (current === `${target.x},${target.y}`) {
      break;
    }

    const adjacentNodes = surroundingNodes(map, current);
    const unvisitedAdjacentNodes = adjacentNodes.filter((node) =>
      unvisited.has(node),
    );

    const currentParsed = parsePositionString(current);

    for (const node of unvisitedAdjacentNodes) {
      const parsed = parsePositionString(node);

      let weight = Infinity;
      const char = map[parsed.y][parsed.x];
      if (char === '#') {
        weight = Infinity;
      } else {
        if (currentParsed.direction === parsed.direction) {
          weight = 1;
        } else {
          weight = 1000;
        }
      }

      const distance = distances.get(current)! + weight;
      distances.set(node, Math.min(distances.get(node)!, distance));
    }

    unvisited.delete(current);
    console.log({ remaining: unvisited.size });
  }

  return Math.min(
    distances.get(`${target.x},${target.y},east`)!,
    distances.get(`${target.x},${target.y},west`)!,
    distances.get(`${target.x},${target.y},south`)!,
    distances.get(`${target.x},${target.y},north`)!,
  ).toString();
}

export const expectedPartTwoSampleOutput = '45';

export function solvePartTwo(input: string): string {
  const map = parseMap(input);

  const unvisited = new Set<positionString>();
  const distances = new Map<positionString, number>();
  const previousNodes = new Map<positionString, positionString[] | null>();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      for (const direction of ['north', 'east', 'south', 'west'] as const) {
        unvisited.add(`${x},${y},${direction}`);
        distances.set(`${x},${y},${direction}`, Infinity);
        previousNodes.set(`${x},${y},${direction}`, null);
      }
    }
  }

  const start = findStartPosition(map);
  const target = findEndPosition(map);
  distances.set(`${start.x},${start.y},east`, 0);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (unvisited.size === 0) {
      break;
    }

    const current = Array.from(unvisited).reduce((minNode, node) => {
      if (distances.get(node)! < distances.get(minNode)!) {
        return node;
      }
      return minNode;
    });

    if (current === `${target.x},${target.y}`) {
      break;
    }

    const adjacentNodes = surroundingNodes(map, current);
    const unvisitedAdjacentNodes = adjacentNodes.filter((node) =>
      unvisited.has(node),
    );

    const currentParsed = parsePositionString(current);

    for (const node of unvisitedAdjacentNodes) {
      const parsed = parsePositionString(node);

      let weight = Infinity;
      const char = map[parsed.y][parsed.x];
      if (char === '#') {
        weight = Infinity;
      } else {
        if (currentParsed.direction === parsed.direction) {
          weight = 1;
        } else {
          weight = 1000;
        }
      }

      const distance = distances.get(current)! + weight;

      if (distance === distances.get(node)!) {
        const previous = previousNodes.get(node);
        previousNodes.set(node, previous ? [...previous, current] : [current]);
      } else if (distance < distances.get(node)!) {
        previousNodes.set(node, [current]);
        distances.set(node, distance);
      }
    }

    unvisited.delete(current);
  }

  const east = distances.get(`${target.x},${target.y},east`)!;
  const west = distances.get(`${target.x},${target.y},west`)!;
  const south = distances.get(`${target.x},${target.y},south`)!;
  const north = distances.get(`${target.x},${target.y},north`)!;

  const minDistance = Math.min(east, west, south, north);

  const index = [east, west, south, north].indexOf(minDistance);
  let targetFull: positionString;

  if (index === 0) {
    targetFull = `${target.x},${target.y},east`;
  } else if (index === 1) {
    targetFull = `${target.x},${target.y},west`;
  } else if (index === 2) {
    targetFull = `${target.x},${target.y},south`;
  } else {
    targetFull = `${target.x},${target.y},north`;
  }

  const paths: positionString[] = [];

  let current = [targetFull];
  paths.push(targetFull);

  while (current.length > 0) {
    const previous: positionString[] = [];

    for (const node of current) {
      const previousNode = previousNodes.get(node);
      console.log({ node, previousNode });
      if (previousNode) {
        previous.push(...previousNode);
        paths.push(...previousNode);
      }
    }

    current = previous;
  }

  const pathCoordinates = paths.map((node) => {
    const { x, y } = parsePositionString(node);
    return `${x},${y}`;
  });
  console.log({ pathCoordinates });

  for (let y = 0; y < map.length; y++) {
    let line = '';
    for (let x = 0; x < map[y].length; x++) {
      if (pathCoordinates.includes(`${x},${y}`)) {
        line += 'O';
      } else if (map[y][x] === '#') {
        line += '#';
      } else {
        line += '.';
      }
    }
    console.log(line);
  }

  // const uniquePathCoordinates = Array.from(new Set(pathCoordinates));
  // console.log({ uniquePathCoordinates: uniquePathCoordinates.length });

  // const seenWalls = new Set<string>();

  // for (const node of uniquePathCoordinates) {
  //   const [x, y] = node.split(',').map((v) => parseInt(v));
  //   const walls = adjacentWalls(map, x, y);
  //   for (const wall of walls) {
  //     seenWalls.add(wall);
  //   }
  // }

  // console.log({ seenWalls });

  return Array.from(new Set(pathCoordinates)).length.toString();
}

function parseMap(input: string): string[][] {
  return input.split('\n').map((line) => line.split(''));
}

type positionString = `${number},${number},${
  | 'east'
  | 'west'
  | 'north'
  | 'south'}`;
function parsePositionString(value: positionString): {
  x: number;
  y: number;
  direction: 'east' | 'west' | 'north' | 'south';
} {
  const [x, y, direction] = value.split(',').map((v) => {
    const parsed = parseInt(v);
    if (isNaN(parsed)) {
      return v;
    } else {
      return parsed;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { x, y, direction } as any;
}

function surroundingNodes(
  map: string[][],
  value: positionString,
): positionString[] {
  const { x, y, direction } = parsePositionString(value);

  if (direction === 'north') {
    return [
      `${x},${y - 1},north` as positionString,
      `${x},${y},west` as positionString,
      `${x},${y},east` as positionString,
    ];
  } else if (direction === 'east') {
    return [
      `${x},${y},north` as positionString,
      `${x + 1},${y},east` as positionString,
      `${x},${y},south` as positionString,
    ];
  } else if (direction === 'south') {
    return [
      `${x},${y + 1},south` as positionString,
      `${x},${y},west` as positionString,
      `${x},${y},east` as positionString,
    ];
  } else if (direction === 'west') {
    return [
      `${x},${y},north` as positionString,
      `${x},${y},south` as positionString,
      `${x - 1},${y},west` as positionString,
    ];
  }

  return [];
}

function findStartPosition(map: string[][]): { x: number; y: number } {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'S') {
        return { x, y };
      }
    }
  }
  throw new Error('No start position found');
}

function findEndPosition(map: string[][]): { x: number; y: number } {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'E') {
        return { x, y };
      }
    }
  }
  throw new Error('No end position found');
}
