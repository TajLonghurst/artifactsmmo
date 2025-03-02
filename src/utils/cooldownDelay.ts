export const cooldownDelay = (time: number) => {
  return new Promise((res) => setTimeout(res, time * 1000));
};
