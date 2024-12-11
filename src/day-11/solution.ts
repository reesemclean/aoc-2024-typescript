export const expectedPartOneSampleOutput = '55312';

export function solvePartOne(input: string): string {
  let values = input.split(' ');

  for (let i = 0; i < 25; i++) {
    values = values.flatMap((value) => {
      const valueAsNumber = BigInt(value);

      if (valueAsNumber == BigInt(0)) {
        return '1';
      } else if (value.length % 2 === 0) {
        const firstHalf = value.slice(0, value.length / 2);
        const secondHalf = value.slice(value.length / 2);

        const firstHalfAsNumber = BigInt(firstHalf);
        const secondHalfAsNumber = BigInt(secondHalf);

        return [firstHalfAsNumber.toString(), secondHalfAsNumber.toString()];
      } else {
        return (valueAsNumber * BigInt(2024)).toString();
      }
    });

    console.log(values);
  }

  return values.length.toString();
}

export const expectedPartTwoSampleOutput = '';

export function solvePartTwo(input: string): string {
  let counts = new Map<string, number>();

  const values = input.split(' ');

  for (const value of values) {
    const previousCount = counts.get(value) ?? 0;
    counts.set(value, previousCount + 1);
  }

  for (let i = 0; i < 75; i++) {
    const nextCounts = new Map<string, number>();

    for (const [value, count] of counts.entries()) {
      const nextValues = getNextValuesForValue(value);

      for (const nextValue of nextValues) {
        const previousCount = nextCounts.get(nextValue) ?? 0;
        nextCounts.set(nextValue, previousCount + count);
      }
    }

    counts = nextCounts;
  }

  function getNextValuesForValue(value: string) {
    const valueAsNumber = BigInt(value);

    if (valueAsNumber == BigInt(0)) {
      return ['1'];
    } else if (value.length % 2 === 0) {
      const firstHalf = value.slice(0, value.length / 2);
      const secondHalf = value.slice(value.length / 2);

      const firstHalfAsNumber = BigInt(firstHalf);
      const secondHalfAsNumber = BigInt(secondHalf);

      const result = [
        firstHalfAsNumber.toString(),
        secondHalfAsNumber.toString(),
      ];
      return result;
    } else {
      const result = (valueAsNumber * BigInt(2024)).toString();
      return [result];
    }
  }

  let sum = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, count] of counts.entries()) {
    sum += count;
  }

  return sum.toString();
}
