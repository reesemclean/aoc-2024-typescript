export const expectedPartOneSampleOutput = '14';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');
  const grid = lines.map((line) => line.split(''));

  const positionsByFrequencies: {
    [frequency: string]: { x: number; y: number }[];
  } = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char === '.') {
        continue;
      }

      if (!positionsByFrequencies[char]) {
        positionsByFrequencies[char] = [];
      }

      positionsByFrequencies[char].push({ x, y });
    }
  }

  const frequencies = Object.keys(positionsByFrequencies);
  const antinodePositions: { x: number; y: number }[] = [];

  for (const frequency of frequencies) {
    const positions = positionsByFrequencies[frequency];

    const positionPairs = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        positionPairs.push([positions[i], positions[j]]);
      }
    }

    for (const positionPair of positionPairs) {
      const [position1, position2] = positionPair;

      const dx = position1.x - position2.x;
      const dy = position1.y - position2.y;

      const above = { x: position1.x + dx, y: position1.y + dy };
      const below = { x: position2.x - dx, y: position2.y - dy };

      for (const position of [above, below]) {
        if (
          position.x >= 0 &&
          position.x < grid[0].length &&
          position.y >= 0 &&
          position.y < grid.length
        ) {
          if (
            !antinodePositions.some(
              (pos) => pos.x === position.x && pos.y === position.y,
            )
          ) {
            antinodePositions.push(position);
          }
        }
      }
    }
  }

  return antinodePositions.length.toString();
}

export const expectedPartTwoSampleOutput = '34';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');
  const grid = lines.map((line) => line.split(''));

  const positionsByFrequencies: {
    [frequency: string]: { x: number; y: number }[];
  } = {};
  const antinodePositions: { x: number; y: number }[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char === '.') {
        continue;
      }

      if (!positionsByFrequencies[char]) {
        positionsByFrequencies[char] = [];
      }

      positionsByFrequencies[char].push({ x, y });
    }
  }

  const frequencies = Object.keys(positionsByFrequencies);

  for (const frequency of frequencies) {
    const positions = positionsByFrequencies[frequency];

    const positionPairs = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        positionPairs.push([positions[i], positions[j]]);
      }
    }

    for (const positionPair of positionPairs) {
      const [position1, position2] = positionPair;

      const dx = position1.x - position2.x;
      const dy = position1.y - position2.y;

      let multiplier = 0;

      /* eslint-disable no-constant-condition */
      while (true) {
        const nextAbovePosition = {
          x: position1.x + multiplier * dx,
          y: position1.y + multiplier * dy,
        };
        const nextBottomPosition = {
          x: position1.x - multiplier * dx,
          y: position1.y - multiplier * dy,
        };
        const validPositions: { x: number; y: number }[] = [];

        if (
          nextAbovePosition.x >= 0 &&
          nextAbovePosition.x < grid[0].length &&
          nextAbovePosition.y >= 0 &&
          nextAbovePosition.y < grid.length
        ) {
          validPositions.push(nextAbovePosition);
        }

        if (
          nextBottomPosition.x >= 0 &&
          nextBottomPosition.x < grid[0].length &&
          nextBottomPosition.y >= 0 &&
          nextBottomPosition.y < grid.length
        ) {
          validPositions.push(nextBottomPosition);
        }

        if (validPositions.length === 0) {
          break;
        }

        for (const nextPosition of validPositions) {
          if (
            !antinodePositions.some(
              (pos) => pos.x === nextPosition.x && pos.y === nextPosition.y,
            )
          ) {
            antinodePositions.push(nextPosition);
          }
        }

        multiplier++;
      }
    }
  }

  console.log(antinodePositions);

  console.log(
    grid
      .map((row, rowIndex) =>
        row
          .map((value, colIndex) => {
            if (value !== '.') {
              return value;
            }

            if (
              antinodePositions.some(
                (pos) => pos.x === colIndex && pos.y === rowIndex,
              )
            ) {
              return '#';
            }

            return '.';
          })
          .join(''),
      )
      .join('\n'),
  );

  return antinodePositions.length.toString();
}
