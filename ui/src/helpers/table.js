export const alternateRowBy = (alternatingValue: number, alternateEven: boolean = true) => {
  return alternateEven
    ? (alternatingValue % 2 === 0) ? '' : 'alternate'
    : (alternatingValue % 2 !== 0) ? '' : 'alternate';
};

export const alternateRowByIndex = (_record: any, index: number) => {
  return alternateRowBy(index);
};
