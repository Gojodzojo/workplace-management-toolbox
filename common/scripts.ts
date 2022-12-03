export function formatDate(d: Date) {
  return d.toLocaleDateString("pl", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
