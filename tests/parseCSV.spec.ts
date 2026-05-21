import { describe, it, expect } from 'vitest';
import { parseCSV, CSVError } from '../src/parseCSV.js';

describe('parseCSV - Full Specification', () => {
  describe('Basic Parsing', () => {
    it('deve processar input básico corretamente', () => {
      expect(parseCSV('a,b,c\nd,e,f')).toEqual([
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
      ]);
    });

    it('deve lidar com campos vazios', () => {
      expect(parseCSV(',,')).toEqual([['', '', '']]);
    });
  });

  describe('Quotes and Escaping', () => {
    it('deve processar campos com quotes', () => {
      expect(parseCSV('"a","b","c"')).toEqual([['a', 'b', 'c']]);
    });

    it('deve processar escaped quotes', () => {
      expect(parseCSV('"a""b"')).toEqual([['a"b']]);
    });

    it('deve processar newline dentro de quotes', () => {
      expect(parseCSV('"a\nb",c')).toEqual([['a\nb', 'c']]);
    });
  });

  describe('Newlines and Edge Cases', () => {
    it('deve lidar com diferentes tipos de newline (LF, CRLF)', () => {
      expect(parseCSV('a,b\r\nc,d')).toEqual([
        ['a', 'b'],
        ['c', 'd'],
      ]);
      expect(parseCSV('a,b\nc,d')).toEqual([
        ['a', 'b'],
        ['c', 'd'],
      ]);
    });

    it('deve tratar EOF corretamente', () => {
      expect(parseCSV('a,b')).toEqual([['a', 'b']]);
    });
  });

  describe('Strict Mode and Error Handling', () => {
    it('deve lançar erro em quote não fechada no modo strict', () => {
      expect(() => parseCSV('"abc', { strict: true })).toThrow(CSVError);
    });

    it('deve lançar erro em quote inesperado no modo strict', () => {
      expect(() => parseCSV('a"b,c', { strict: true })).toThrow(CSVError);
    });

    it('deve permitir quote não fechada no modo permissive (default)', () => {
      expect(parseCSV('"abc')).toEqual([['abc']]);
    });
  });

  describe('Options (Trim, SkipEmptyLines, PreserveWhitespace)', () => {
    it('deve aplicar trim quando solicitado', () => {
      expect(parseCSV(' a , b ', { trim: true })).toEqual([['a', 'b']]);
    });

    it('deve preservar whitespace quando preserveWhitespace for true', () => {
      expect(parseCSV(' a , b ', { preserveWhitespace: true })).toEqual([
        [' a ', ' b '],
      ]);
    });

    it('deve pular linhas vazias com skipEmptyLines', () => {
      expect(parseCSV('a,b\n\n\n', { skipEmptyLines: true })).toEqual([
        ['a', 'b'],
      ]);
    });
  });
});
