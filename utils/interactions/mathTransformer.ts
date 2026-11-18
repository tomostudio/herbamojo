type TransformValueOptions = {
  start?: number
  end?: number
  value?: number | null
}

/**
 * Where `value` sits between `start` and `end`, as a 0–1 ratio rounded to two
 * places. Undefined when there is no value.
 */
export const transformValue = ({
  start = 0,
  end = 100,
  value = null,
}: TransformValueOptions): number | undefined => {
  if (value !== null) {
    const range = Math.abs(end - start)
    return (
      Math.round((Math.min(Math.max(value - start, 0), range) / range) * 100) /
      100
    )
  }
}
