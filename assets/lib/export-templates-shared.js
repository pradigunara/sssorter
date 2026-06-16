export function titleDate() {
  const now = new Date();
  return `bias sort · ${now.toLocaleString("en-US", { month: "short" }).toLowerCase()} ${now.getFullYear()}`;
}