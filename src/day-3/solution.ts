export const expectedPartOneSampleOutput = '161';

export function solvePartOne(input: string): string {
  // Regex to match "mul(1,2)"
  const regex = /mul\((\d+),(\d+)\)/g;

  const matches = input.matchAll(regex);

  let sum = 0;
  for (const match of matches) {
    // match[0] is the full match, e.g. "mul(1,2)"

    // a is the string after mul(
    const a = match[0].split('(')[1];

    // b is the first number, c is the last number plus a )
    const [b, c] = a.split(',');

    // d is now the last number
    const d = c.slice(0, -1);

    const result = parseInt(b) * parseInt(d);
    sum += result;
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '48';

export function solvePartTwo(input: string): string {
  const regex = /(mul\((\d+),(\d+)\))|don't|do/g;
  const matches = input.matchAll(regex);

  let isEnabled = true;
  let sum = 0;

  for (const match of matches) {
    const value = match[0];

    if (value === "don't") {
      isEnabled = false;
    } else if (value === 'do') {
      isEnabled = true;
    } else if (isEnabled) {
      const a = match[0].split('(')[1];

      const [b, c] = a.split(',');
      const d = c.slice(0, -1);

      const result = parseInt(b) * parseInt(d);
      sum += result;
    }
  }

  return sum.toString();
}
