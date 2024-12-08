export const expectedPartOneSampleOutput = '143';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const rules: { first: number; last: number }[] = [];
  const updates: number[][] = [];

  let parsingRules = true;
  for (const line of lines) {
    if (parsingRules) {
      if (line === '') {
        parsingRules = false;
        continue;
      }

      const parts = line.split('|');
      rules.push({
        first: parseInt(parts[0]),
        last: parseInt(parts[1]),
      });
    } else {
      const parts = line.split(',');
      updates.push(parts.map((part) => parseInt(part)));
    }
  }

  const safeUpdates: number[][] = [];

  for (const update of updates) {
    let correctOrder = true;

    loop1: for (let i = 0; i < update.length; i++) {
      const value = update[i];
      const rulesWithValueAsFirst = rules.filter(
        (rule) => rule.first === value,
      );
      const pagesNeedingToComeAfter = rulesWithValueAsFirst.map(
        (rule) => rule.last,
      );

      for (let j = i - 1; j >= 0; j--) {
        const previousValue = update[j];
        if (pagesNeedingToComeAfter.includes(previousValue)) {
          correctOrder = false;
          break loop1;
        }
      }

      const rulesWithValueAsLast = rules.filter((rule) => rule.last === value);
      const pagesNeedingToComeBefore = rulesWithValueAsLast.map(
        (rule) => rule.first,
      );

      for (let j = i + 1; j < update.length; j++) {
        const nextValue = update[j];
        if (pagesNeedingToComeBefore.includes(nextValue)) {
          correctOrder = false;
          break loop1;
        }
      }
    }

    if (correctOrder) {
      safeUpdates.push(update);
    }
  }

  console.log(safeUpdates);

  let sum = 0;
  for (const update of safeUpdates) {
    const middleValue = update[Math.floor(update.length / 2)];
    console.log(middleValue);
    sum += middleValue;
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '123';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const rules: { first: number; last: number }[] = [];
  const updates: number[][] = [];

  let parsingRules = true;
  for (const line of lines) {
    if (parsingRules) {
      if (line === '') {
        parsingRules = false;
        continue;
      }

      const parts = line.split('|');
      rules.push({
        first: parseInt(parts[0]),
        last: parseInt(parts[1]),
      });
    } else {
      const parts = line.split(',');
      updates.push(parts.map((part) => parseInt(part)));
    }
  }

  const unsafeUpdates: number[][] = [];

  for (const update of updates) {
    let correctOrder = true;

    loop1: for (let i = 0; i < update.length; i++) {
      const value = update[i];
      const rulesWithValueAsFirst = rules.filter(
        (rule) => rule.first === value,
      );
      const pagesNeedingToComeAfter = rulesWithValueAsFirst.map(
        (rule) => rule.last,
      );

      for (let j = i - 1; j >= 0; j--) {
        const previousValue = update[j];
        if (pagesNeedingToComeAfter.includes(previousValue)) {
          correctOrder = false;
          break loop1;
        }
      }

      const rulesWithValueAsLast = rules.filter((rule) => rule.last === value);
      const pagesNeedingToComeBefore = rulesWithValueAsLast.map(
        (rule) => rule.first,
      );

      for (let j = i + 1; j < update.length; j++) {
        const nextValue = update[j];
        if (pagesNeedingToComeBefore.includes(nextValue)) {
          correctOrder = false;
          break loop1;
        }
      }
    }

    if (!correctOrder) {
      unsafeUpdates.push(update);
    }
  }

  const fixedUpdates: number[][] = [];

  for (const update of unsafeUpdates) {
    const relevantRules = rules.filter((rule) => {
      return update.includes(rule.first) && update.includes(rule.last);
    });
    const possibleFirstValues = relevantRules.map((rule) => rule.first);
    const possibleLastValues = relevantRules.map((rule) => rule.last);

    const counts: { value: number; count: number }[] = [];

    for (const value of update) {
      const count = { value, count: 0 };

      for (const first of possibleFirstValues) {
        if (first === value) {
          count.count--;
        }
      }

      for (const last of possibleLastValues) {
        if (last === value) {
          count.count++;
        }
      }

      counts.push(count);
    }

    const ordered = counts
      .sort((left, right) => left.count - right.count)
      .map((count) => count.value);

    fixedUpdates.push(ordered);
  }

  console.log(unsafeUpdates);

  let sum = 0;
  for (const update of fixedUpdates) {
    const middleValue = update[Math.floor(update.length / 2)];
    console.log(middleValue);
    sum += middleValue;
  }

  return sum.toString();
}
