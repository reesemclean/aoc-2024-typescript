export const expectedPartOneSampleOutput = '18';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');
  const rows = lines.map((line) => line.split(''));

  let count = 0;

  for (let column = 0; column < rows.length; column++) {
    for (let row = 0; row < rows[column].length; row++) {
      const current = rows[column][row];

      if (current !== 'X') {
        continue;
      }

      console.log(column, row);

      if (column > 2) {
        // check left
        if (
          rows[column - 1][row] === 'M' &&
          rows[column - 2][row] === 'A' &&
          rows[column - 3][row] === 'S'
        ) {
          count++;
        }

        if (row > 2) {
          // check up and to the left
          if (
            rows[column - 1][row - 1] === 'M' &&
            rows[column - 2][row - 2] === 'A' &&
            rows[column - 3][row - 3] === 'S'
          ) {
            count++;
          }
        }

        if (row < rows[column].length - 3) {
          // check up and to the right
          if (
            rows[column - 1][row + 1] === 'M' &&
            rows[column - 2][row + 2] === 'A' &&
            rows[column - 3][row + 3] === 'S'
          ) {
            count++;
          }
        }
      }

      if (column < rows.length - 3) {
        // check right
        if (
          rows[column + 1][row] === 'M' &&
          rows[column + 2][row] === 'A' &&
          rows[column + 3][row] === 'S'
        ) {
          count++;
        }

        if (row > 2) {
          // check down and to the left
          if (
            rows[column + 1][row - 1] === 'M' &&
            rows[column + 2][row - 2] === 'A' &&
            rows[column + 3][row - 3] === 'S'
          ) {
            count++;
          }
        }

        if (row < rows[column].length - 3) {
          // check down and to the right
          if (
            rows[column + 1][row + 1] === 'M' &&
            rows[column + 2][row + 2] === 'A' &&
            rows[column + 3][row + 3] === 'S'
          ) {
            count++;
          }
        }
      }

      if (row > 2) {
        // check up
        if (
          rows[column][row - 1] === 'M' &&
          rows[column][row - 2] === 'A' &&
          rows[column][row - 3] === 'S'
        ) {
          count++;
        }
      }

      if (row < rows[column].length - 3) {
        // check down
        if (
          rows[column][row + 1] === 'M' &&
          rows[column][row + 2] === 'A' &&
          rows[column][row + 3] === 'S'
        ) {
          count++;
        }
      }
    }
  }

  return count.toString();
}

export const expectedPartTwoSampleOutput = '9';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');
  const rows = lines.map((line) => line.split(''));

  let count = 0;

  for (let column = 0; column < rows.length; column++) {
    for (let row = 0; row < rows[column].length; row++) {
      const current = rows[column][row];

      if (current !== 'A') {
        continue;
      }

      const topLeft = rows[column - 1]?.[row - 1];
      const topRight = rows[column - 1]?.[row + 1];
      const bottomLeft = rows[column + 1]?.[row - 1];
      const bottomRight = rows[column + 1]?.[row + 1];

      if (
        ((topLeft === 'M' && bottomRight === 'S') ||
          (topLeft === 'S' && bottomRight === 'M')) &&
        ((topRight === 'M' && bottomLeft === 'S') ||
          (topRight === 'S' && bottomLeft === 'M'))
      ) {
        count++;
      }
    }
  }

  return count.toString();
}
