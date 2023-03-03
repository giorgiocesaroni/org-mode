// import SUPPORTED_TAGS
import { SUPPORTED_TAGS } from "../config/tags";

export const TAG_REGEX_PATTERN = `^(\\*+)\\s+(${SUPPORTED_TAGS.join(
   "|"
)})?\\s*(.*)?`;
export const TAG_REGEX = new RegExp(TAG_REGEX_PATTERN);
