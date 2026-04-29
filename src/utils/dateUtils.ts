const pad = (n: number) => String(n).padStart(2, "0");

export const formatDateToYYYYMMDD = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatDisplayTime = (dt: string): string =>
  new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });