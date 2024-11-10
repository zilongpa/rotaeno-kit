export const closeTo = (a: number, b: number, epsilon = 0.00001) => {
  return Math.abs(a - b) < epsilon
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

export const coerceToNumber = (value: string | number, defaultValue = 0) => {
  if (typeof value === 'number') {
    return value
  }

  const parsed = parseFloat(value)
  return isNaN(parsed) || !isFinite(parsed) ? defaultValue : parsed
}
