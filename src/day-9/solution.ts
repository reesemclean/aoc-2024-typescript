export const expectedPartOneSampleOutput = '1928';

export function solvePartOne(input: string): string {
  const values = input.split('').map(Number);

  const fileLengths = values.filter((value, index) => index % 2 === 0);
  const emptyLengths = values.filter((value, index) => index % 2 === 1);

  const compacted: (number | 'empty')[] = [];

  for (let i = 0; i < fileLengths.length; i++) {
    const valueLength = fileLengths[i];
    const id = i;

    for (let count = 0; count < valueLength; count++) {
      compacted.push(id);
    }

    const emptyLength = emptyLengths[i];
    if (emptyLength != null) {
      for (let count = 0; count < emptyLength; count++) {
        compacted.push('empty');
      }
    }
  }

  for (let i = compacted.length - 1; i >= 0; i--) {
    const value = compacted[i];

    if (value === 'empty') {
      continue;
    }

    compacted[i] = 'empty';

    const firstEmptyIndex = compacted.findIndex((value) => value === 'empty');
    compacted[firstEmptyIndex] = value;
  }

  let sum = 0;
  for (let i = 0; i < compacted.length; i++) {
    const value = compacted[i];

    if (value === 'empty') {
      continue;
    }

    sum += value * i;
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '2858';

export function solvePartTwo(input: string): string {
  const values = input.split('').map(Number);

  const fileLengths = values.filter((value, index) => index % 2 === 0);
  const emptyLengths = values.filter((value, index) => index % 2 === 1);

  const compacted: { id: number | 'empty'; length: number }[] = [];

  for (let i = 0; i < fileLengths.length; i++) {
    const valueLength = fileLengths[i];
    const id = i;

    compacted.push({ id, length: valueLength });

    const emptyLength = emptyLengths[i];
    if (emptyLength != null) {
      compacted.push({ id: 'empty', length: emptyLength });
    }
  }

  const idsMoved = new Set<number>();

  for (let i = compacted.length - 1; i >= 0; i--) {
    const block = compacted[i];

    const blockLength = block.length;
    const blockId = block.id;

    if (blockId === 'empty') {
      continue;
    }

    if (idsMoved.has(blockId)) {
      continue;
    }

    idsMoved.add(blockId);

    for (let j = 0; j < i; j++) {
      const otherBlock = compacted[j];
      const otherBlockLength = otherBlock.length;
      const otherBlockId = otherBlock.id;

      if (otherBlockId !== 'empty') {
        continue;
      }

      if (blockLength > otherBlockLength) {
        continue;
      }

      const remainingLength = otherBlockLength - blockLength;

      compacted[i] = { id: 'empty', length: blockLength };

      if (remainingLength === 0) {
        compacted[j] = { id: blockId, length: blockLength };
      } else {
        compacted[j] = { id: 'empty', length: remainingLength };
        compacted.splice(j, 0, { id: blockId, length: blockLength });
      }

      break;
    }
  }

  console.log(compacted);

  let sum = 0;
  let blockIndex = 0;

  for (let i = 0; i < compacted.length; i++) {
    const block = compacted[i];

    if (block.id === 'empty') {
      blockIndex += block.length;
      continue;
    }

    const id = block.id;

    for (let j = 0; j < block.length; j++) {
      sum += id * blockIndex;
      blockIndex++;
    }
  }

  return sum.toString();
}
