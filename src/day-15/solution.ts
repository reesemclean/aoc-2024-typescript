export const expectedPartOneSampleOutput = '10092';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const grid: string[][] = [];
  const moves: ('<' | '>' | '^' | 'v')[] = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      const chars = line.split('');
      grid.push(chars);
    } else if (
      line.startsWith('>') ||
      line.startsWith('<') ||
      line.startsWith('^') ||
      line.startsWith('v')
    ) {
      const chars = line.split('');
      moves.push(...(chars as ('<' | '>' | '^' | 'v')[]));
    }
  }

  let robotLocation = { x: 0, y: 0 };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '@') {
        robotLocation = { x, y };
      }
    }
  }

  console.log(robotLocation);
  console.log(moves);

  for (const move of moves) {
    const nextVector: { x: number; y: number } = { x: 0, y: 0 };
    switch (move) {
      case '<':
        nextVector.x -= 1;
        break;
      case '>':
        nextVector.x += 1;
        break;
      case '^':
        nextVector.y -= 1;
        break;
      case 'v':
        nextVector.y += 1;
        break;
    }

    const nextLocation = {
      x: robotLocation.x + nextVector.x,
      y: robotLocation.y + nextVector.y,
    };

    if (grid[nextLocation.y][nextLocation.x] === '.') {
      grid[robotLocation.y][robotLocation.x] = '.';
      grid[nextLocation.y][nextLocation.x] = '@';
      robotLocation = nextLocation;
    } else if (grid[nextLocation.y][nextLocation.x] === 'O') {
      let nextBoxLocation = { x: nextLocation.x, y: nextLocation.y };
      const boxesToMove = [nextBoxLocation];

      let shouldMove = true;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        nextBoxLocation = {
          x: nextBoxLocation.x + nextVector.x,
          y: nextBoxLocation.y + nextVector.y,
        };
        const char = grid[nextBoxLocation.y][nextBoxLocation.x];

        if (char === '.') {
          shouldMove = true;
          break;
        } else if (char === '#') {
          shouldMove = false;
          break;
        } else if (char === 'O') {
          boxesToMove.push(nextBoxLocation);
        }
      }

      if (shouldMove) {
        grid[nextLocation.y + nextVector.y * boxesToMove.length][
          nextLocation.x + nextVector.x * boxesToMove.length
        ] = 'O';
        grid[robotLocation.y][robotLocation.x] = '.';
        grid[nextLocation.y][nextLocation.x] = '@';
        robotLocation = nextLocation;
      }
    }

    grid.forEach((row) => console.log(row.join('')));
    console.log('---');
  }

  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'O') {
        sum += y * 100 + x;
      }
    }
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '';

import { emitKeypressEvents } from 'readline';
emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

export function solvePartTwo(input: string): string {
  const { grid, moves } = parseInput(input);

  let currentGrid = grid;
  currentGrid.forEach((row) => console.log(row.join('')));
  console.log('---');

  process.stdin.on('keypress', (chunk, key) => {
    if (key && key.name == 'q') {
      process.exit();
    }

    let move: '>' | '<' | '^' | 'v' = '>';
    if (key && key.name == 'down') {
      move = 'v';
    } else if (key && key.name == 'up') {
      move = '^';
    } else if (key && key.name == 'left') {
      move = '<';
    } else if (key && key.name == 'right') {
      move = '>';
    }

    const nextGrid = getNextGrid(currentGrid, move);
    currentGrid = nextGrid;
    currentGrid.forEach((row) => console.log(row.join('')));
    console.log('---');
    // console.log({ key });
  });

  moves: for (const move of moves) {
    const nextGrid = getNextGrid(currentGrid, move);
    currentGrid = nextGrid;

    currentGrid.forEach((row) => console.log(row.join('')));
    console.log('---');

    for (let y = 0; y < currentGrid.length; y++) {
      for (let x = 0; x < currentGrid[y].length; x++) {
        if (currentGrid[y][x] === ']' && currentGrid[y][x - 1] !== '[') {
          console.log('last move: ', move);
          break moves;
        }

        if (currentGrid[y][x] === '[' && currentGrid[y][x + 1] !== ']') {
          console.log('last move: ', move);
          break moves;
        }
      }
    }
  }

  let sum = 0;
  for (let y = 0; y < currentGrid.length; y++) {
    for (let x = 0; x < currentGrid[y].length; x++) {
      if (currentGrid[y][x] === '[') {
        sum += y * 100 + x;
      }
    }
  }

  return sum.toString();
}

function getNextGrid(
  grid: string[][],
  move: '>' | '<' | '^' | 'v',
): string[][] {
  const robotLocation = findRobotLocation(grid);
  const nextVector = getVector(move);

  const nextLocation = {
    x: robotLocation.x + nextVector.x,
    y: robotLocation.y + nextVector.y,
  };

  const nextChar = grid[nextLocation.y][nextLocation.x];

  if (nextChar === '.') {
    grid[robotLocation.y][robotLocation.x] = '.';
    grid[nextLocation.y][nextLocation.x] = '@';
  } else if (nextChar === '[' || nextChar === ']') {
    const boxesToMove: { x: number; y: number }[] = [];
    let shouldMove = true;

    if (nextVector.x === 0) {
      const positionsToCheck = [robotLocation];

      while (positionsToCheck.length > 0) {
        const position = positionsToCheck.pop()!;

        const nextPositionToCheck = {
          x: position.x + nextVector.x,
          y: position.y + nextVector.y,
        };
        const nextCharToCheck =
          grid[nextPositionToCheck.y][nextPositionToCheck.x];

        if (nextCharToCheck === '.') {
          continue;
        } else if (nextCharToCheck === '#') {
          shouldMove = false;
          break;
        } else if (nextCharToCheck === '[') {
          positionsToCheck.push(nextPositionToCheck);
          positionsToCheck.push({
            x: nextPositionToCheck.x + 1,
            y: nextPositionToCheck.y,
          });
          boxesToMove.push(nextPositionToCheck);
        } else if (nextCharToCheck === ']') {
          positionsToCheck.push(nextPositionToCheck);
          positionsToCheck.push({
            x: nextPositionToCheck.x - 1,
            y: nextPositionToCheck.y,
          });

          if (
            !boxesToMove.some(
              (box) =>
                box.x === nextPositionToCheck.x - 1 &&
                box.y === nextPositionToCheck.y,
            )
          ) {
            boxesToMove.push({
              x: nextPositionToCheck.x - 1,
              y: nextPositionToCheck.y,
            });
          }
        }
      }

      // Here we have all the boxes to move
      if (shouldMove) {
        const sortedBoxesToMove = boxesToMove.sort((a, b) => {
          if (nextVector.y < 0) {
            return b.y - a.y || a.x - b.x;
          } else {
            return a.y - b.y || a.x - b.x;
          }
        });

        for (let i = sortedBoxesToMove.sort().length - 1; i >= 0; i--) {
          const box = sortedBoxesToMove[i];
          const nextBoxLocation = {
            x: box.x + nextVector.x,
            y: box.y + nextVector.y,
          };
          grid[box.y][box.x] = '.';
          grid[box.y][box.x + 1] = '.';
          grid[nextBoxLocation.y][nextBoxLocation.x] = '[';
          grid[nextBoxLocation.y][nextBoxLocation.x + 1] = ']';
        }

        grid[robotLocation.y][robotLocation.x] = '.';
        grid[nextLocation.y][nextLocation.x] = '@';
      }
    } else {
      const positionsToCheck = [robotLocation];

      while (positionsToCheck.length > 0) {
        const position = positionsToCheck.pop()!;

        const nextPositionToCheck = {
          x: position.x + nextVector.x,
          y: position.y + nextVector.y,
        };
        const nextCharToCheck =
          grid[nextPositionToCheck.y][nextPositionToCheck.x];

        if (nextCharToCheck === '.') {
          shouldMove = true;
          break;
        } else if (nextCharToCheck === '#') {
          shouldMove = false;
          break;
        } else if (nextCharToCheck === '[') {
          boxesToMove.push(nextPositionToCheck);
          positionsToCheck.push({
            x: nextPositionToCheck.x + 1,
            y: nextPositionToCheck.y,
          });
        } else if (nextCharToCheck === ']') {
          boxesToMove.push({
            x: nextPositionToCheck.x - 1,
            y: nextPositionToCheck.y,
          });
          positionsToCheck.push({
            x: nextPositionToCheck.x - 1,
            y: nextPositionToCheck.y,
          });
        }
      }

      if (shouldMove) {
        for (let i = boxesToMove.length - 1; i >= 0; i--) {
          const box = boxesToMove[i];
          const nextBoxLocation = {
            x: box.x + nextVector.x,
            y: box.y + nextVector.y,
          };
          grid[box.y][box.x] = '.';
          grid[box.y][box.x + 1] = '.';
          grid[nextBoxLocation.y][nextBoxLocation.x] = '[';
          grid[nextBoxLocation.y][nextBoxLocation.x + 1] = ']';
        }

        grid[robotLocation.y][robotLocation.x] = '.';
        grid[nextLocation.y][nextLocation.x] = '@';
      }
    }
  } else {
    // wall - do nothing
  }

  return grid;
}

function getVector(move: '<' | '>' | '^' | 'v') {
  const nextVector: { x: number; y: number } = { x: 0, y: 0 };
  switch (move) {
    case '<':
      nextVector.x -= 1;
      break;
    case '>':
      nextVector.x += 1;
      break;
    case '^':
      nextVector.y -= 1;
      break;
    case 'v':
      nextVector.y += 1;
      break;
  }

  return nextVector;
}

function parseInput(input: string) {
  const lines = input.split('\n');

  const grid: string[][] = [];
  const moves: ('<' | '>' | '^' | 'v')[] = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      const nextLine: string[] = [];
      const chars = line.split('');
      for (const char of chars) {
        if (char === '@') {
          nextLine.push('@');
          nextLine.push('.');
        } else if (char === '#' || char === '.') {
          nextLine.push(char);
          nextLine.push(char);
        } else if (char === 'O') {
          nextLine.push('[');
          nextLine.push(']');
        }
      }
      grid.push(nextLine);
    } else if (
      line.startsWith('>') ||
      line.startsWith('<') ||
      line.startsWith('^') ||
      line.startsWith('v')
    ) {
      const chars = line.split('');
      moves.push(...(chars as ('<' | '>' | '^' | 'v')[]));
    }
  }

  return { grid, moves };
}

function findRobotLocation(grid: string[][]) {
  let robotLocation = { x: 0, y: 0 };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '@') {
        robotLocation = { x, y };
      }
    }
  }
  return robotLocation;
}
