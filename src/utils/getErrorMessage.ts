export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "Unknown error"
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
