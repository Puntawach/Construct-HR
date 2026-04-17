const TZ_OFFSET_MS = 7 * 60 * 60 * 1000;

export function toDateKey(date: Date | string): string {
  const utc = new Date(date).getTime();
  const local = new Date(utc + TZ_OFFSET_MS);
  return `${local.getUTCFullYear()}-${local.getUTCMonth() + 1}-${local.getUTCDate()}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}
