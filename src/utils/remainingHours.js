import { differenceInHours } from "date-fns";

export function remainingHours(date) {
   if (!date || isNaN(date)) return;
   const today = new Date();
   return differenceInHours(date, today);
}
