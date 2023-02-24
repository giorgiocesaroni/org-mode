export default function getStringify(object) {
   return fetch("http://192.168.1.14:3000/stringify", {
      headers: {
         "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(object),
   });
}
