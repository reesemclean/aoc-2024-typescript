export const expectedPartOneSampleOutput = '2';

export function solvePartOne(input: string): string {
  const report = input.split('\n');

  const safeReports = report.filter((report) => {
    const levels = report.split(' ');

    const direction = parseInt(levels[0]) > parseInt(levels[1]) ? 'down' : 'up';

    for (let i = 0; i < levels.length - 1; i++) {
      const left = parseInt(levels[i]);
      const right = parseInt(levels[i + 1]);

      console.log(left, right);

      const distance = left - right;

      console.log(distance);
      if (Math.abs(distance) < 1 || Math.abs(distance) > 3) {
        return false;
      }

      if (direction === 'down' && distance < 0) {
        console.log('down', distance);
        return false;
      } else if (direction === 'up' && distance > 0) {
        console.log('up', distance);
        return false;
      }
    }

    return true;
  });

  return safeReports.length.toString();
}

export const expectedPartTwoSampleOutput = '4';

function isSafe(levels: number[]) {
  const direction = levels[0] > levels[1] ? 'down' : 'up';

  for (let i = 0; i < levels.length - 1; i++) {
    const left = levels[i];
    const right = levels[i + 1];

    const distance = left - right;

    console.log(distance);
    if (Math.abs(distance) < 1 || Math.abs(distance) > 3) {
      return false;
    }

    if (direction === 'down' && distance < 0) {
      return false;
    } else if (direction === 'up' && distance > 0) {
      return false;
    }
  }

  console.log('Safe');

  return true;
}

export function solvePartTwo(input: string): string {
  const reports = input
    .split('\n')
    .map((report) => report.split(' ').map((level) => parseInt(level)));

  let countOfSafeReports = 0;
  for (const report of reports) {
    if (isSafe(report)) {
      countOfSafeReports++;
      continue;
    }

    for (let i = 0; i < report.length; i++) {
      const temp = [...report];
      temp.splice(i, 1);
      console.log(temp);
      if (isSafe(temp)) {
        countOfSafeReports++;
        break;
      }
    }
  }

  return countOfSafeReports.toString();
}
