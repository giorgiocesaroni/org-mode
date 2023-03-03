import OrgParser from "../parsing/parser/OrgParser";

export default function getStringify(object) {
   const parser = new OrgParser();
   return parser.stringify(object);

   return fetch("http://192.168.1.14:3000/stringify", {
      headers: {
         "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(object),
   });
}
