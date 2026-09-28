import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addCommas',
})
export class AddCommasPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === "") return "";

    // 1. Separate leading non-digit characters (e.g. currency symbols like ₹)
    const match = value.toString().match(/^(\D*)(.*)$/);
    const prefix = match ? match[1] : '';
    const numericPart = match ? match[2] : value.toString();

    // Clean out existing commas and extra whitespace from the numeric portion
    const cleanNumeric = numericPart.replace(/,/g, '').trim();
    if (!cleanNumeric) return value.toString();

    // 2. Split integer and decimal parts
    const decimalFloat = cleanNumeric.split('.');
    const integerPart = decimalFloat[0];
    const decimalPart = decimalFloat[1];

    let formattedInteger = integerPart;

    // 3. ONLY format if the integer part is actually 4 digits or longer
    if (integerPart.length > 3) {
      const lastThree = integerPart.substring(integerPart.length - 3);
      const otherNumbers = integerPart.substring(0, integerPart.length - 3);

      const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      formattedInteger = `${formattedOthers},${lastThree}`;
    }

    // 4. Return the finalized string with original prefix
    const result = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    return `${prefix}${result}`;
  }
}
