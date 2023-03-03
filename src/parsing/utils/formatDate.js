import { pad } from "../../utils/pad";

export function formatDate(date) {
   // yyyy-mm-dd HH:MM
   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
   )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
