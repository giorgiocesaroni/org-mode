import { formatDate } from "../utils/formatDate";

export default class OrgNode {
   constructor({
      tag,
      tagText = "",
      level = 0,
      children = [],
      text = "",
      schedule,
      deadline,
   }) {
      this.tag = tag;
      this.tagText = tagText;
      this.level = level;
      this.children = children;
      this.text = text;
      this.schedule = schedule;
      this.deadline = deadline;
   }

   static fromObject(object) {
      if (!object.children) {
         object.children = [];
      }

      return new OrgNode({
         ...object,
         children: object.children.map(child => this.fromObject(child)),
      });
   }

   toString() {
      const result = [];

      const header = `${"*".repeat(this.level)}${
         this.tag && this.tag != "HEADER" ? ` ${this.tag}` : ""
      }${this.tagText ? ` ${this.tagText}` : ""}\n`;

      if (this.tag != "ROOT") {
         result.push(header);
      }

      if (this.schedule) {
         let date = new Date(this.schedule);
         result.push(`SCHEDULED: <${formatDate(date)}>\n`);
      }

      if (this.deadline) {
         let date = new Date(this.deadline);
         result.push(`DEADLINE: <${formatDate(date)}>\n`);
      }

      if (this.text) {
         result.push(this.text);
      }

      const childrenContent = this.children
         .map(node => node.toString())
         ?.join("");
      if (childrenContent) result.push(childrenContent);

      return result.join("");
   }
}
