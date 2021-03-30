import {currencyFormatter} from '../currency/formatter';

/**
 * Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior. Different
 * implementations produce different results when a radix is not specified, usually defaulting the value to 10.
 * @param value Value to convert to a integer.
 * @param radix A value between 2 and 36 that specifies the base of the number in numString.
 * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
 * All other strings are considered decimal.
 */
export function int(value: any, radix: number = 10): number {
  return parseInt(value, radix);
}

export function money(value: number) {
  return currencyFormatter.format(value);
}
