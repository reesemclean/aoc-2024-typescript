export const expectedPartOneSampleOutput = '22';

export function solvePartOne(input: string, isTest: boolean): string {
  const dimensions = isTest ? 6 : 70;
  const numberOfBytes = isTest ? 12 : 1024;
  const bytes = input.split('\n').map((line) => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  });

  const grid = new Array(dimensions + 1)
    .fill('.')
    .map(() => new Array(dimensions + 1).fill('.'));

  for (let i = 0; i < numberOfBytes; i++) {
    const byte = bytes[i];
    grid[byte.y][byte.x] = '#';
  }

  const unvisited = new Set<string>();
  const distances = new Map<string, number>();
  const previousNodes = new Map<string, string[] | null>();

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      unvisited.add(`${x},${y}`);
      distances.set(`${x},${y}`, Infinity);
      previousNodes.set(`${x},${y}`, null);
    }
  }

  const start = { x: 0, y: 0 };
  const target = { x: dimensions, y: dimensions };
  distances.set(`${start.x},${start.y}`, 0);

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

    const [x, y] = current.split(',').map(Number);
    const adjacentNodes = [
      `${x},${y - 1}`,
      `${x + 1},${y}`,
      `${x},${y + 1}`,
      `${x - 1},${y}`,
    ];
    const unvisitedAdjacentNodes = adjacentNodes.filter((node) =>
      unvisited.has(node),
    );

    for (const node of unvisitedAdjacentNodes) {
      const [x, y] = node.split(',').map(Number);

      let weight = Infinity;
      const char = grid[y][x];
      if (char === '#') {
        weight = Infinity;
      } else {
        weight = 1;
      }

      const distance = distances.get(current)! + weight;
      if (distance === distances.get(node)!) {
        const previous = previousNodes.get(node)!;
        previousNodes.set(node, [...(previous || []), current]);
      } else if (distance < distances.get(node)!) {
        previousNodes.set(node, [current]);
        distances.set(node, distance);
      }
    }

    unvisited.delete(current);
  }

  const paths: string[] = [];

  let current = [`${target.x},${target.y}`];
  paths.push(`${target.x},${target.y}`);

  while (current.length > 0) {
    const previous: string[] = [];

    for (const node of current) {
      const previousNode = previousNodes.get(node);
      if (previousNode) {
        // previous.push(...previousNode);
        // paths.push(...previousNode);
        previous.push(previousNode[0]);
        paths.push(previousNode[0]);
      }
    }
    current = previous;
  }

  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < grid[y].length; x++) {
      if (paths.includes(`${x},${y}`)) {
        line += 'O';
      } else if (grid[y][x] === '#') {
        line += '#';
      } else {
        line += '.';
      }
    }
    console.log(line);
  }

  return (paths.length - 1).toString();
}

export const expectedPartTwoSampleOutput = '6,1';

export function solvePartTwo(input: string, isTest: boolean): string {
  const dimensions = isTest ? 6 : 70;
  const bytes = input.split('\n').map((line) => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  });

  const grid = new Array(dimensions + 1)
    .fill('.')
    .map(() => new Array(dimensions + 1).fill('.'));

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    grid[byte.y][byte.x] = '#';

    grid.forEach((row) => {
      console.log(row.join(''));
    });

    const unvisited = new Set<string>();
    const distances = new Map<string, number>();
    const previousNodes = new Map<string, string[] | null>();

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        unvisited.add(`${x},${y}`);
        distances.set(`${x},${y}`, Infinity);
        previousNodes.set(`${x},${y}`, null);
      }
    }

    const start = { x: 0, y: 0 };
    const target = { x: dimensions, y: dimensions };
    distances.set(`${start.x},${start.y}`, 0);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (unvisited.size === 0) {
        return `${byte.x},${byte.y}`;
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

      const [x, y] = current.split(',').map(Number);
      const adjacentNodes = [
        `${x},${y - 1}`,
        `${x + 1},${y}`,
        `${x},${y + 1}`,
        `${x - 1},${y}`,
      ];
      const unvisitedAdjacentNodes = adjacentNodes.filter((node) =>
        unvisited.has(node),
      );

      for (const node of unvisitedAdjacentNodes) {
        const [x, y] = node.split(',').map(Number);

        let weight = Infinity;
        const char = grid[y][x];
        if (char === '#') {
          weight = Infinity;
        } else {
          weight = 1;
        }

        const distance = distances.get(current)! + weight;

        if (distance < Infinity && distance === distances.get(node)!) {
          const previous = previousNodes.get(node)!;
          previousNodes.set(node, [...(previous || []), current]);
        } else if (distance < Infinity && distance < distances.get(node)!) {
          previousNodes.set(node, [current]);
          distances.set(node, distance);
        }
      }

      unvisited.delete(current);
    }

    const paths: string[] = [];

    let current = [`${target.x},${target.y}`];
    paths.push(`${target.x},${target.y}`);

    while (current.length > 0) {
      const previous: string[] = [];

      for (const node of current) {
        const previousNode = previousNodes.get(node);
        if (previousNode) {
          // previous.push(...previousNode);
          // paths.push(...previousNode);
          previous.push(previousNode[0]);
          paths.push(previousNode[0]);
        }
      }
      current = previous;
    }

    for (let y = 0; y < grid.length; y++) {
      let line = '';
      for (let x = 0; x < grid[y].length; x++) {
        if (paths.includes(`${x},${y}`)) {
          line += 'O';
        } else if (grid[y][x] === '#') {
          line += '#';
        } else {
          line += '.';
        }
      }
      console.log(line);
    }

    if (paths.length === 1) {
      return `${byte.x},${byte.y}`;
    }
  }

  return '';
}
