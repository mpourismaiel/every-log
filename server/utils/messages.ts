export const success = (message?: string) => ({
  message: message || 'success',
});
export const error = (err?: string) => ({
  error: err || 'something happened',
});
