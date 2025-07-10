export function summarizeText(text: string): string {
  const sentences = text.split(/\.\s+/).slice(0, 3); // first 3 sentences
  return sentences.join(". ") + "."; // return as paragraph
}
