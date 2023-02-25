import { pad } from "./pad";

export function dateForPicker(date) {
   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
   )}`;
}
