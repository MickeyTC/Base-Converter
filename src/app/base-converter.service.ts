import { Injectable } from '@angular/core';

@Injectable()
export class BaseConverterService {

  constructor() { }

  private static filterInt(num: string): number {
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(num)) {
      return Number(num);
    }
    return Number.NaN;
  }

  static convert(n: string, fromBase: number, toBase: number): string {
    return this.decToBase(this.toDec(n, fromBase), toBase);
  }

  static decToBase(nDec: number, base: number): string {
    return Number(nDec).toString(base);
  }

  static toDec(n: string, base: number): number {
    let num = n.trim();
    const dots: string[] = num.split('.');
    let power = 0;
    if (dots.length === 2) {
      power = num.length - 1 - num.indexOf('.');
      num = dots[0] + dots[1];
    } else if (dots.length > 2) {
      return Number.NaN;
    }

    return Number.parseInt(num, base) * Math.pow(base, -power);
  }
}
