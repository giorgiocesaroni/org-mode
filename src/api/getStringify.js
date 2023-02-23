export default function getStringify(object) {
   return fetch("http://localhost:3000/stringify", {
      headers: {
         "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(object),
   });
}
