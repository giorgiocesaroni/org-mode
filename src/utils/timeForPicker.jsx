import { pad } from "./pad";

export function timeForPicker(date) {
   return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
