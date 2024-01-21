import { ExtractedContent } from "./types";

const MAX_PROMPT_SIZE = 1000;

export default function sanitizedContent(extractContent: ExtractedContent): string{
  let bodyValue = "";
  Object.values(extractContent.headers).forEach(value => bodyValue += value + " ");
  // Object.values(extractContent.meta).forEach(value => bodyValue += value + " ");
  // Object.values(extractContent.nav_links).forEach(value => bodyValue += value + " ");
  // Object.values(extractContent.url).forEach(value => bodyValue += value + " ");

  let missingSpace = MAX_PROMPT_SIZE - bodyValue.length;
  if (missingSpace < 0) {
    console.warn("returning earlier.");
    return bodyValue;
  }

  let middleOfMainContentIndex = (extractContent.main_content.length / 2) | 0
  let middleOfMainText = extractContent.main_content.substring(middleOfMainContentIndex - missingSpace / 2, middleOfMainContentIndex + missingSpace / 2)
  return bodyValue + middleOfMainText;
}