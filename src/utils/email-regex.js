export default function matchesEmailRegex(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}