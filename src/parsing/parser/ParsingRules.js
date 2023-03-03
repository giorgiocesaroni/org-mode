import { SCHEDULE_REGEX } from "../regex/schedule";
import { DEADLINE_REGEX } from "../regex/deadline";
import { TAG_REGEX } from "../regex/tag";
import OrgNode from "./OrgNode";

export const PARSING_RULES = [
   {
      description: "Schedule directive",
      match: line => SCHEDULE_REGEX.test(line),
      decorate: (line, cue) => {
         const [, year, month, day, hour, minute] = SCHEDULE_REGEX.exec(line);
         cue.at(-1).schedule = new Date(
            year,
            month - 1,
            day,
            hour ?? 0,
            minute ?? 0
         );
      },
   },
   {
      description: "Deadline directive",
      match: line => DEADLINE_REGEX.test(line),
      decorate: (line, cue) => {
         const [, year, month, day, hour, minute] = DEADLINE_REGEX.exec(line);
         cue.at(-1).deadline = new Date(
            year,
            month - 1,
            day,
            hour ?? 0,
            minute ?? 0
         );
      },
   },
   {
      description: "Tag directive",
      match: line => TAG_REGEX.test(line),
      decorate: (line, cue) => {
         const previousLevel = cue.at(-1).level;
         const tag = TAG_REGEX.exec(line);
         const tagLevel = tag[1].length;
         const keyword = tag[2] ?? "HEADER";
         const tagText = tag[3];

         if (tagLevel > previousLevel) {
            // Going deeper
            cue.push(new OrgNode({ tag: keyword, tagText, level: tagLevel }));
         } else if (tagLevel === previousLevel) {
            // Staying
            const last = cue.pop();
            cue.at(-1).children.push(last);
            cue.push(new OrgNode({ tag: keyword, tagText, level: tagLevel }));
         } else if (tagLevel < previousLevel) {
            // Going shallower
            const lastCueLength = cue.length;
            for (let i = 0; i < lastCueLength - tagLevel; i++) {
               const last = cue.pop();
               cue.at(-1).children.push(last);
            }

            cue.push(new OrgNode({ tag: keyword, tagText, level: tagLevel }));
         }
      },
   },
   {
      description: "Body text",
      match: () => true,
      decorate: (line, cue) => {
         cue.at(-1).text += line ? `${line}\n` : "\n";
      },
   },
];
