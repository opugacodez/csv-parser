export interface ParseOptions {
  separator?: string;
  quote?: string;
  strict?: boolean;
  trim?: boolean;
  skipEmptyLines?: boolean;
  preserveWhitespace?: boolean;
}

export class CSVError extends Error {
  constructor(
    public message: string,
    public position: number,
  ) {
    super(`[CSVError] ${message} at position ${position}`);
    this.name = 'CSVError';
  }
}

export function parseCSV(
  input: string,
  options: ParseOptions = {},
): string[][] {
  const {
    separator = ',',
    quote = '"',
    strict = false,
    trim = false,
    skipEmptyLines = false,
    preserveWhitespace = false,
  } = options;

  const result: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuote = false;

  const normalize = (f: string) =>
    preserveWhitespace ? f : trim ? f.trim() : f;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const next = input[i + 1];

    if (inQuote) {
      if (char === quote) {
        if (next === quote) {
          field += quote;
          i++;
        } else {
          inQuote = false;
        }
      } else {
        field += char;
      }
    } else if (char === quote) {
      if (strict && field.length > 0) throw new CSVError('Unexpected quote', i);
      inQuote = true;
    } else if (char === separator) {
      row.push(normalize(field));
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && next === '\n') i++;
      row.push(normalize(field));
      if (
        !skipEmptyLines ||
        row.length > 1 ||
        (row.length === 1 && row[0] !== '')
      ) {
        result.push(row);
      }
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (strict && inQuote) throw new CSVError('Unclosed quote', input.length);

  if (field !== '' || row.length > 0) {
    row.push(normalize(field));
    if (
      !skipEmptyLines ||
      row.length > 1 ||
      (row.length === 1 && row[0] !== '')
    ) {
      result.push(row);
    }
  }

  return result;
}
