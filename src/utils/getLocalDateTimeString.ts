export const getLocalDateTimeString = (sourceTimezone: string): string => {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: sourceTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {} as Record<string, string>);

  const datetime = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  return datetime;
}
