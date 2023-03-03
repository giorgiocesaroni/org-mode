import OrgNode from "./OrgNode";
import { PARSING_RULES } from "./ParsingRules";

export default class OrgParser {
   parse(text) {
      if (!text || typeof text !== "string") {
         return {};
      }

      const LINES = text.split("\n");
      const CUE = [new OrgNode({ tag: "ROOT" })];

      for (let line of LINES) {
         for (let handle of PARSING_RULES) {
            if (handle.match(line)) {
               handle.decorate(line, CUE);
               break;
            }
         }
      }

      const lastCueLength = CUE.length;
      for (let i = 0; i < lastCueLength - 1; i++) {
         const last = CUE.pop();
         CUE.at(-1).children.push(last);
      }

      return CUE[0];
   }

   stringify(object) {
      if (!object || typeof object !== "object") {
         return "";
      }

      // Stringify an orgObject
      const orgNode = OrgNode.fromObject(object);
      const result = orgNode.toString();
      return result.trim();
   }
}
