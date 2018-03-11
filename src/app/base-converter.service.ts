import { Injectable } from '@angular/core';

@Injectable()
export class BaseConverterService {

  constructor() { }

  static convert(n: string, fromBase: number, toBase: number): string {
    if (!(n && fromBase && toBase)) { return null; }
    return fromBase === toBase ? n : this.decToBase(this.toDec(n, fromBase), toBase);
  }

  static decToBase(nDec: number, base: number): string {
    return nDec && base ? nDec.toString(base) : null;
  }

  static toDec(n: string, base: number): number {
    if (!this.isCompatible(n, base)) { return Number.NaN; }
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

  static isCompatible(num: string, base: number): boolean {
    if (!num || !base) {
      return false;
    }
    const char = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const number = num.trim().toUpperCase();
    for (const d of number) {
      if (char.indexOf(d) >= base) {
        return false;
      }
    }
    return true;
  }
}
