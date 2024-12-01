export const expectedPartOneSampleOutput = '11';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const left: number[] = [];
  const right: number[] = [];

  lines.forEach((line) => {
    const [l, r] = line.split('   ');
    left.push(parseInt(l));
    right.push(parseInt(r));
  });

  const leftSorted = left.sort((a, b) => a - b);
  const rightSorted = right.sort((a, b) => a - b);

  let totalDistance = 0;
  for (let i = 0; i < leftSorted.length; i++) {
    const leftValue = leftSorted[i];
    const rightValue = rightSorted[i];
    const distance = Math.abs(rightValue - leftValue);
    totalDistance += distance;
  }

  return totalDistance.toString();
}

export const expectedPartTwoSampleOutput = '31';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const left: number[] = [];
  const right: number[] = [];

  lines.forEach((line) => {
    const [l, r] = line.split('   ');
    left.push(parseInt(l));
    right.push(parseInt(r));
  });

  let total = 0;
  for (let i = 0; i < left.length; i++) {
    const leftValue = left[i];
    const countInRight = right.filter(
      (rightValue) => rightValue === leftValue,
    ).length;
    const similarityScore = leftValue * countInRight;
    total += similarityScore;
  }

  return total.toString();
}
