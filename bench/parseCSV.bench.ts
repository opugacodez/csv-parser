import { bench, describe } from 'vitest';
import { parseCSV } from '../src/parseCSV.js';

describe('Performance', () => {
  const input = 'a,b,c\n1,2,3\n"multi\nline",4,5'.repeat(1000);

  bench('parse 3000 rows', () => {
    parseCSV(input, { trim: true, skipEmptyLines: true });
  });
});
