import OrgParser from "../parsing/parser/OrgParser";

export default function getParsed(text) {
   const parser = new OrgParser();

   return parser.parse(text);

   return fetch("http://192.168.1.14:3000/parse", {
      method: "POST",
      body: text,
   });
}
