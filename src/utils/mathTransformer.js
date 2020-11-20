export const transformValue = ({ start = 0, end = 100, value = null }) => {
  if (value !== null) {
    const range = Math.abs(end - start);
    return (
      Math.round((Math.min(Math.max(value - start, 0), range) / range) * 100) /
      100
    );
  }
};
