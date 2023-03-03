export default function pad(x) {
   // 1 -> 01
   return String(x).padStart(2, "0");
}
