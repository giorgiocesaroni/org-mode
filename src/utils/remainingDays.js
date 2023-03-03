import { differenceInDays } from "date-fns";

export function remainingDays(date) {
   if (!date || isNaN(date)) return;
   const today = new Date();
   return differenceInDays(date, today);
}
