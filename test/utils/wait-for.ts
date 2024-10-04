export function waitFor(
  assertions: () => void | Promise<any>,
  maxDuration = 1000
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;
    const interval = setInterval(async () => {
      elapsedTime += 10;
      try {
        await assertions();
        clearInterval(interval);
        resolve();
      } catch (error) {
        if (elapsedTime >= maxDuration) {
          reject(error);
        }
      }
    }, 10);
  });
}
