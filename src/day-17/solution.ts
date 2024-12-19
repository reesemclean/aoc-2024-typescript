export const expectedPartOneSampleOutput = '4,6,3,5,6,3,5,2,1,0';

export function solvePartOne(input: string): string {
  // eslint-disable-next-line prefer-const
  let { a, b, c, program } = parseInit(input);

  const outputValues = runProgram({ a, b, c, program });

  return outputValues.map((value) => value.toString()).join(',');
}

export const expectedPartTwoSampleOutput = '117440';

export function solvePartTwo(input: string): string {
  // eslint-disable-next-line prefer-const

  // let a = 3;
  // let b = 0;
  // let c = 0;
  const { program } = parseInit(input);

  // const outputValues = runProgram({ a: 31, b: 0, c: 0, program });
  // console.log({ outputValues });
  let possibleAValues = [0, 1, 2, 3, 4, 5, 6, 7].map(BigInt);

  for (let i = program.length - 1; i > 0; i--) {
    const target = program.slice(i).join(',');
    const nextPossibleAValues: bigint[] = [];

    for (let j = 0; j < possibleAValues.length; j++) {
      const possibleAValue = possibleAValues[j];
      const outputValues = runProgram({
        a: possibleAValue,
        b: BigInt(0),
        c: BigInt(0),
        program,
      });
      if (outputValues.join(',') === target) {
        console.log({ possibleAValue, target });
        nextPossibleAValues.push(possibleAValue);
      }
    }

    possibleAValues = nextPossibleAValues.flatMap((value) => {
      return [
        value * BigInt(8) + BigInt(0),
        value * BigInt(8) + BigInt(1),
        value * BigInt(8) + BigInt(2),
        value * BigInt(8) + BigInt(3),
        value * BigInt(8) + BigInt(4),
        value * BigInt(8) + BigInt(5),
        value * BigInt(8) + BigInt(6),
        value * BigInt(8) + BigInt(7),
      ];
    });
    console.log({ possibleAValues });
  }

  const final = possibleAValues.filter((value) => {
    const outputValues = runProgram({
      a: value,
      b: BigInt(0),
      c: BigInt(0),
      program,
    });
    return outputValues.join(',') === program.join(',');
  });

  console.log({ final });

  return final[0].toString();
}

function parseInit(input: string) {
  const lines = input.split('\n');
  const a = BigInt(parseInt(lines[0].split(': ')[1], 10));
  const b = BigInt(parseInt(lines[1].split(': ')[1], 10));
  const c = BigInt(parseInt(lines[2].split(': ')[1], 10));

  const program = lines[4].split(': ')[1].split(',').map(BigInt);

  return { a, b, c, program };
}

function runProgram(init: {
  a: bigint;
  b: bigint;
  c: bigint;
  program: bigint[];
  maxOutput?: number;
}): bigint[] {
  let { a, b, c } = init;
  const { program } = init;

  let counter = 0;
  const outputValues: bigint[] = [];

  function operandLiteralValue(operand: bigint) {
    return operand;
  }

  function operandComboValue(operand: bigint) {
    switch (operand) {
      case BigInt(0):
      case BigInt(1):
      case BigInt(2):
      case BigInt(3):
        return operand;
      case BigInt(4):
        return a;
      case BigInt(5):
        return b;
      case BigInt(6):
        return c;
      case BigInt(7):
        throw new Error('Invalid operand');
      default:
        throw new Error('Invalid operand');
    }
  }

  program: while (counter < program.length) {
    const instruction = program[counter];
    const operand = program[counter + 1];

    switch (instruction) {
      case BigInt(0): {
        // adv
        // Numberator is A
        // Denominator is 2^Operand (combo)
        // Truncate to integer and store in A
        const numerator = a;
        const denominator = bigIntPow(BigInt(2), operandComboValue(operand));
        a = numerator / denominator;
        counter += 2;
        break;
      }
      case BigInt(1): {
        // bxl BITWISE XOR of B and operand (literal), store in B
        const xor = operandLiteralValue(operand) ^ b;
        b = xor;
        counter += 2;
        break;
      }
      case BigInt(2): {
        // bst
        // Operand (combo) mod 8 (i.e. lower 3 bits), store in B
        const operandValue = operandComboValue(operand);
        b = operandValue % BigInt(8);
        counter += 2;
        break;
      }
      case BigInt(3): {
        // jnz
        // If A register is zero, nothing
        // If A register is not zero, jump to operand value (literal)
        // No increment after jump
        if (a === BigInt(0)) {
          counter += 2;
        } else {
          counter = Number(operandLiteralValue(operand));
        }
        break;
      }
      case BigInt(4): {
        // bxc
        // bitwise XOR of register B and C, store in b
        // Read operand but ignore
        b = b ^ c;
        counter += 2;
        break;
      }
      case BigInt(5): {
        // out
        // operand (combo) mod 8, then output value
        const operandValue = operandComboValue(operand);
        outputValues.push(operandValue % BigInt(8));
        if (outputValues.length === init.maxOutput) {
          break program;
        }
        counter += 2;
        break;
      }
      case BigInt(6): {
        // bdv
        // works like adv, but stores in B, numerator still A
        const numerator = a;
        const denominator = bigIntPow(BigInt(2), operandComboValue(operand));
        b = numerator / denominator;
        counter += 2;
        break;
      }
      case BigInt(7): {
        // cdv
        // works like adv, but stores in C, numerator still A
        const numerator = a;
        const denominator = bigIntPow(BigInt(2), operandComboValue(operand));
        c = numerator / denominator;
        counter += 2;
        break;
      }
      default:
        throw new Error('Invalid instruction');
    }
  }

  return outputValues;
}

function bigIntPow(base: bigint, exponent: bigint): bigint {
  if (exponent < 0n) {
    throw new Error('Exponent must be non-negative');
  }

  let result = 1n;
  for (let i = 0n; i < exponent; i++) {
    result *= base;
  }
  return result;
}
