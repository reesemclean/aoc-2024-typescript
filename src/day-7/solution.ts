export const expectedPartOneSampleOutput = '3749';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  let sum = 0;

  for (const line of lines) {
    const parts = line.split(': ');

    const desiredValue = parseInt(parts[0], 10);
    const values = parts[1].split(' ').map((value) => parseInt(value, 10));

    let totals = [values[0]];

    for (let i = 1; i < values.length; i++) {
      const nextValue = values[i];
      totals = totals.flatMap((total) => {
        return [nextValue + total, nextValue * total];
      });
    }

    if (totals.includes(desiredValue)) {
      sum += desiredValue;
    }
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '11387';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  let sum = 0;

  for (const line of lines) {
    const parts = line.split(': ');

    const desiredValue = parseInt(parts[0], 10);
    const values = parts[1].split(' ').map((value) => parseInt(value, 10));

    let totals = [values[0]];

    for (let i = 1; i < values.length; i++) {
      const nextValue = values[i];
      totals = totals.flatMap((total) => {
        return [
          nextValue + total,
          nextValue * total,
          parseInt(`${total}${nextValue}`, 10),
        ];
      });
    }

    if (totals.includes(desiredValue)) {
      sum += desiredValue;
    }
  }

  return sum.toString();
}
