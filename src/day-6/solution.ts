export const expectedPartOneSampleOutput = '41';

const directions = ['^', '>', 'v', '<'];

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const grid: string[][] = [];
  const hitIndexes: { row: number; col: number }[] = [];

  for (const line of lines) {
    const row = [];
    const chars = line.split('');
    row.push(...chars);
    grid.push(row);
  }

  function nextStep(grid: string[][]) {
    const newGrid = grid.map((row) => [...row]);
    let foundIndex: { row: number; col: number } | null = null;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        if (!directions.includes(cell)) {
          continue;
        }

        foundIndex = { row: i, col: j };
      }
    }

    if (!foundIndex) {
      return null;
    }

    if (
      !hitIndexes.some(
        (index) =>
          index.row === foundIndex!.row && index.col === foundIndex!.col,
      )
    ) {
      hitIndexes.push(foundIndex);
    }

    if (newGrid[foundIndex.row][foundIndex.col] === '^') {
      if (foundIndex.row - 1 < 0) {
        return null;
      } else if (newGrid[foundIndex.row - 1][foundIndex.col] === '#') {
        newGrid[foundIndex.row][foundIndex.col + 1] = '>';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      } else {
        newGrid[foundIndex.row - 1][foundIndex.col] = '^';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      }
    } else if (newGrid[foundIndex.row][foundIndex.col] === '>') {
      if (foundIndex.col + 1 >= newGrid[foundIndex.row].length) {
        return null;
      } else if (newGrid[foundIndex.row][foundIndex.col + 1] === '#') {
        newGrid[foundIndex.row + 1][foundIndex.col] = 'v';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      } else {
        newGrid[foundIndex.row][foundIndex.col + 1] = '>';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      }
    } else if (newGrid[foundIndex.row][foundIndex.col] === 'v') {
      if (foundIndex.row + 1 >= newGrid.length) {
        return null;
      } else if (newGrid[foundIndex.row + 1][foundIndex.col] === '#') {
        newGrid[foundIndex.row][foundIndex.col - 1] = '<';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      } else {
        newGrid[foundIndex.row + 1][foundIndex.col] = 'v';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      }
    } else if (newGrid[foundIndex.row][foundIndex.col] === '<') {
      if (foundIndex.col - 1 < 0) {
        return null;
      } else if (newGrid[foundIndex.row][foundIndex.col - 1] === '#') {
        newGrid[foundIndex.row - 1][foundIndex.col] = '^';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      } else {
        newGrid[foundIndex.row][foundIndex.col - 1] = '<';
        newGrid[foundIndex.row][foundIndex.col] = '.';
      }
    }

    return newGrid;
  }

  let currentGrid = grid;

  /* eslint-disable no-constant-condition */
  while (true) {
    const newGrid = nextStep(currentGrid);
    if (!newGrid) {
      break;
    }

    currentGrid = newGrid;
  }

  const debug: string[][] = [];

  for (let i = 0; i < grid.length; i++) {
    const row = [];

    for (let j = 0; j < grid[i].length; j++) {
      if (hitIndexes.some((index) => index.row === i && index.col === j)) {
        row.push('X');
      } else {
        row.push('.');
      }
    }

    debug.push(row);
  }

  return hitIndexes.length.toString();
}

export const expectedPartTwoSampleOutput = '6';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const grid: string[][] = [];

  for (const line of lines) {
    const row = [];
    const chars = line.split('');
    row.push(...chars);
    grid.push(row);
  }

  const found: { row: number; col: number }[] = [];

  // let row = 7;
  // let col = 7;
  for (let row = 0; row < grid.length; row++) {
    // for (let row = 0; row < 1; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      // for (let col = 0; col < 1; col++) {
      console.log({ row, col });
      if (grid[row][col] !== '.') {
        continue;
      }

      const newGrid = grid.map((row) => [...row]);
      newGrid[row][col] = '#';

      const result = simulate(newGrid);

      if (result) {
        if (
          !found.some(
            (position) => position.row === row && position.col === col,
          )
        ) {
          found.push({ row, col });
        }
      }
    }
  }

  function simulate(grid: string[][]) {
    const guardIndex = findIndexOfGuard(grid);
    if (!guardIndex) {
      return { result: false, seenGuardPostions: [] };
    }

    const initialGuardDirection = grid[guardIndex.row][guardIndex.col];
    let currentDirection = initialGuardDirection;
    let currentColumn = guardIndex.col;
    let currentRow = guardIndex.row;
    const seenGuardPostions: { row: number; col: number; direction: string }[] =
      [];

    while (
      currentRow >= 0 &&
      currentRow < grid.length &&
      currentColumn >= 0 &&
      currentColumn < grid[currentRow].length
    ) {
      if (grid[currentRow][currentColumn] === '#') {
        if (currentDirection === '^') {
          currentDirection = '>';
          currentRow++;
        } else if (currentDirection === '>') {
          currentDirection = 'v';
          currentColumn--;
        } else if (currentDirection === 'v') {
          currentDirection = '<';
          currentRow--;
        } else if (currentDirection === '<') {
          currentDirection = '^';
          currentColumn++;
        }
        continue;
      }

      if (
        seenGuardPostions.some(
          (position) =>
            position.row === currentRow &&
            position.col === currentColumn &&
            position.direction === currentDirection,
        )
      ) {
        console.log({ currentColumn, currentRow, currentDirection });
        return true;
      }

      seenGuardPostions.push({
        row: currentRow,
        col: currentColumn,
        direction: currentDirection,
      });

      if (currentDirection === '^') {
        currentRow--;
      } else if (currentDirection === '>') {
        currentColumn++;
      } else if (currentDirection === 'v') {
        currentRow++;
      } else if (currentDirection === '<') {
        currentColumn--;
      }
    }

    return false;
  }

  function findIndexOfGuard(grid: string[][]) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        if (!directions.includes(cell)) {
          continue;
        }

        return { row: i, col: j };
      }
    }

    return null;
  }

  console.log({ found });
  return found.length.toString();
}
