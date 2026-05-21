export class CSVError extends Error {
  constructor(public message: string, public position: number) {
    super(`${message} at position ${position}`);
    this.name = 'CSVError';
  }
}

export interface CSVOptions {
  separator?: string;
  quote?: string;
  strict?: boolean;
}

export function parseCSV(input: string, options: CSVOptions = {}): string[][] {
  const { separator = ',', quote = '"', strict = false } = options;
  const result: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (inQuote) {
      if (char === quote) {
        if (nextChar === quote) {
          field += quote;
          i++;
        } else {
          inQuote = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === quote) {
        if (strict && field.length > 0) {
          throw new CSVError('Unexpected quote', i);
        }
        inQuote = true;
      } else if (char === separator) {
        row.push(field);
        field = '';
      } else if (char === '\r' && nextChar === '\n') {
        row.push(field);
        result.push(row);
        row = [];
        field = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        row.push(field);
        result.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }
  }

  if (strict && inQuote) {
    throw new CSVError('Unclosed quote', input.length);
  }

  row.push(field);
  result.push(row);

  return result;
}
