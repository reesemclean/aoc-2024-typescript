export const expectedPartOneSampleOutput = '480';

export function solvePartOne(input: string): string {
  const machines = parseMachines(input);

  let tokensSpent = 0;

  for (const machine of machines) {
    const { ax, ay, bx, by, prizeX, prizeY } = machine;
    let minCost = Infinity;
    for (let a = 0; a <= 100; a++) {
      for (let b = 0; b <= 100; b++) {
        const distanceX = prizeX - (a * ax + b * bx);
        const distanceY = prizeY - (a * ay + b * by);

        if (distanceX !== 0 || distanceY !== 0) {
          continue;
        }

        minCost = Math.min(minCost, a * 3 + b * 1);
      }
    }

    if (minCost !== Infinity) {
      tokensSpent += minCost;
    }
  }

  return tokensSpent.toString();
}

function parseMachines(input: string) {
  const machines: {
    ax: number;
    ay: number;
    bx: number;
    by: number;
    prizeX: number;
    prizeY: number;
  }[] = [];

  machines.push({ ax: 0, ay: 0, bx: 0, by: 0, prizeX: 0, prizeY: 0 });

  for (const line of input.split('\n')) {
    if (line === '') {
      machines.push({ ax: 0, ay: 0, bx: 0, by: 0, prizeX: 0, prizeY: 0 });
      continue;
    }

    const machine = machines[machines.length - 1];

    if (line.startsWith('Button A')) {
      const [, ax, ay] = line
        .match(/Button A: X\+(\d+), Y\+(\d+)/)!
        .map(Number);
      machine.ax = ax;
      machine.ay = ay;
    } else if (line.startsWith('Button B')) {
      const [, bx, by] = line
        .match(/Button B: X\+(\d+), Y\+(\d+)/)!
        .map(Number);
      machine.bx = bx;
      machine.by = by;
    } else if (line.startsWith('Prize')) {
      const [, prizeX, prizeY] = line
        .match(/Prize: X=(\d+), Y=(\d+)/)!
        .map(Number);
      machine.prizeX = prizeX;
      machine.prizeY = prizeY;
    }
  }

  return machines;
}

export const expectedPartTwoSampleOutput = '';

export function solvePartTwo(input: string): string {
  const machines = parseMachines(input);
  machines.forEach((machine) => {
    machine.prizeX = machine.prizeX + 10000000000000;
    machine.prizeY = machine.prizeY + 10000000000000;
  });

  let sum = BigInt(0);
  for (const machine of machines) {
    const { ax, ay, bx, by, prizeX, prizeY } = machine;

    const multiplyTop = BigInt(ay);
    const multiplyBottom = BigInt(ax);
    const firstStepTopBs = BigInt(bx) * multiplyTop;
    const firstStepBottomBs = BigInt(by) * multiplyBottom;
    const firstStepPrizeX = BigInt(prizeX) * multiplyTop;
    const firstStepPrizeY = BigInt(prizeY) * multiplyBottom;

    const BDiff = firstStepTopBs - firstStepBottomBs;
    const prizeDiff = firstStepPrizeX - firstStepPrizeY;

    const remainder = prizeDiff % BDiff;

    if (remainder !== BigInt(0)) {
      continue;
    }

    const numberOfBPresses = prizeDiff / BDiff;

    const bxDistance = BigInt(bx) * numberOfBPresses;
    const axDistance = BigInt(prizeX) - bxDistance;

    const aRemainder = axDistance % BigInt(ax);

    if (aRemainder !== BigInt(0)) {
      continue;
    }

    const numberOfAPresses = axDistance / BigInt(ax);

    const cost = numberOfAPresses * BigInt(3) + numberOfBPresses;

    sum += cost;
  }

  return sum.toString();
}
