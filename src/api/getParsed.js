export default function getParsed(text) {
   return fetch("http://localhost:3000/parse", {
      method: "POST",
      body: text,
   });
}
