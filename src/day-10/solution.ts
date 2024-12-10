export const expectedPartOneSampleOutput = '36';

export function solvePartOne(input: string): string {
  const grid = input
    .split('\n')
    .map((row) => row.split('').map((value) => parseInt(value)));

  console.log(grid);

  const trailheads: { x: number; y: number }[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) {
        trailheads.push({ x, y });
      }
    }
  }

  let sum = 0;

  for (const trailhead of trailheads) {
    const nextCells = recursiveFindNextCells(grid, trailhead.x, trailhead.y);
    const uniques = new Set(nextCells.map((cell) => `${cell.x},${cell.y}`));
    console.log({ nextCells });
    sum += uniques.size;
  }

  return sum.toString();
}

function recursiveFindNextCells(
  grid: number[][],
  x: number,
  y: number,
): { x: number; y: number }[] {
  const value = grid[y][x];

  if (value === 9) {
    return [{ x, y }];
  }

  const nextCells = findNextCells(x, y, grid);

  return nextCells.flatMap((cell) => {
    return recursiveFindNextCells(grid, cell.x, cell.y);
  });
}

function findNextCells(
  x: number,
  y: number,
  grid: number[][],
): { x: number; y: number }[] {
  const cells: { x: number; y: number }[] = [];
  const value = grid[y][x];
  const nextValue = value + 1;

  if (grid[y][x + 1] === nextValue) {
    cells.push({ x: x + 1, y });
  }

  if (y < grid.length - 1 && grid[y + 1][x] === nextValue) {
    cells.push({ x, y: y + 1 });
  }

  if (grid[y][x - 1] === nextValue) {
    cells.push({ x: x - 1, y });
  }

  if (y > 0 && grid[y - 1][x] === nextValue) {
    cells.push({ x, y: y - 1 });
  }

  return cells;
}

export const expectedPartTwoSampleOutput = '81';

export function solvePartTwo(input: string): string {
  const grid = input
    .split('\n')
    .map((row) => row.split('').map((value) => parseInt(value)));

  console.log(grid);

  const trailheads: { x: number; y: number }[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) {
        trailheads.push({ x, y });
      }
    }
  }

  let sum = 0;

  for (const trailhead of trailheads) {
    const nextCells = recursiveFindNextCells(grid, trailhead.x, trailhead.y);
    sum += nextCells.length;
  }

  return sum.toString();
}
