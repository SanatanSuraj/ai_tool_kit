import parser from "cron-parser";

export function getNextExecutions(cronExpression: string, count = 5): Date[] {
  try {
    const interval = parser.parse(cronExpression);
    const dates: Date[] = [];

    for (let i = 0; i < count; i++) {
      dates.push(interval.next().toDate());
    }

    return dates;
  } catch (err) {
    throw new Error("Invalid cron expression");
  }
}
