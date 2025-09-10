export function toCamelCase(header = ""): string {
  const words = header.split(" ");
  let result = words[0].toLowerCase();

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    result += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  return result;
}