import { describe, it, expect } from 'vitest';
import { parseCSV, CSVError } from '../src/parseCSV';

describe('parseCSV - Robustness & Error Handling', () => {
  it('deve processar input básico corretamente', () => {
    expect(parseCSV('a,b,c\nd,e,f')).toEqual([['a', 'b', 'c'], ['d', 'e', 'f']]);
  });

  it('deve lançar CSVError no modo strict para quote não fechada', () => {
    expect(() => parseCSV('"abc', { strict: true })).toThrow(CSVError);
  });

  it('deve permitir quote não fechada no modo permissive (default)', () => {
    expect(parseCSV('"abc')).toEqual([['abc']]);
  });

  it('deve lançar erro em quote inesperado no modo strict', () => {
    expect(() => parseCSV('a"b,c', { strict: true })).toThrow(CSVError);
  });

  it('deve processar escaped quotes corretamente', () => {
    expect(parseCSV('"a""b"')).toEqual([['a"b']]);
  });

  it('deve lidar com campos vazios', () => {
    expect(parseCSV(',,')).toEqual([['', '', '']]);
  });
});
