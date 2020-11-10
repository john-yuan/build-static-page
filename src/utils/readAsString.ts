export const readAsString = (value: unknown) => {
  return value === null || value === undefined ? '' : `${value}`
}
