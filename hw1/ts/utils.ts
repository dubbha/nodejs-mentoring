export const logErrorIfAny = (err?: Error | null)  => {
  if (err) {
    console.error(err);
  }
}
