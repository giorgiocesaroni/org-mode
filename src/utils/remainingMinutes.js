import { differenceInMinutes } from "date-fns";

export function remainingMinutes(date) {
   if (!date || isNaN(date)) return;
   const today = new Date();
   return differenceInMinutes(date, today);
}
