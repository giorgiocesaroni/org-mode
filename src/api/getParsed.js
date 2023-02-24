export default function getParsed(text) {
   return fetch("http://192.168.1.14:3000/parse", {
      method: "POST",
      body: text,
   });
}
