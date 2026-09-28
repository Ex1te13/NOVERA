export type Period = "today" | "yesterday" | "7d" | "30d" | "month" | "year";

export const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Сегодня" },
  { id: "yesterday", label: "Вчера" },
  { id: "7d", label: "7 дней" },
  { id: "30d", label: "30 дней" },
  { id: "month", label: "Месяц" },
  { id: "year", label: "Год" },
];
