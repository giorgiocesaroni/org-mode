import React, { useState, useEffect, useRef } from "react";
import getParsed from "./api/getParsed";
import getStringify from "./api/getStringify";

function App() {
   const [text, setText] = useState(localStorage.getItem("text") ?? "");
   const [parsed, setParsed] = useState(null);
   const rootRef = useRef({});

   useEffect(() => {
      if (!text) return setParsed(null);
      handleParsing(text);
      localStorage.setItem("text", text ?? "");
   }, [text]);

   async function handleParsing(text) {
      const res = await getParsed(text);
      const body = await res.json();
      rootRef.current = body;
      setParsed(body);
   }

   async function handleTreeChange() {
      const res = await getStringify(rootRef.current);
      const body = await res.text();
      setText(body);
   }

   return (
      <main className="border p-4 grid grid-cols-2 gap-2 h-full">
         <TextArea
            value={text}
            onChange={event => setText(event.target.value)}
         />
         <Visualizer root={rootRef.current} onChange={handleTreeChange} />
      </main>
   );
}

function TextArea({ value, onChange }) {
   return (
      <textarea
         className="border bg-slate p-2"
         value={value}
         onChange={onChange}
      />
   );
}

function Visualizer({ root, onChange }) {
   if (!root) return;

   console.log(root);

   function handleTaskChange() {
      if (root.tag === "TODO") {
         root.tag = "DONE";
      } else {
         root.tag = "TODO";
      }

      onChange();
   }

   function handleScheduleChange(event) {
      const date = new Date(event.target.value);
      root.schedule = date;
      onChange();
   }

   function handleDeadlineChange(event) {
      const date = new Date(event.target.value);
      root.deadline = date;
      onChange();
   }

   return (
      <div className="border p-2">
         <Task tag={root.tag} onChange={handleTaskChange} />
         <Schedule schedule={root.schedule} onChange={handleScheduleChange} />
         <Deadline deadline={root.deadline} onChange={handleDeadlineChange} />
         <h1>{root.tagText}</h1>
         <p className="mb-4 whitespace-pre-wrap">{root.text}</p>
         {root.children?.map(child => (
            <Visualizer root={child} onChange={onChange} />
         ))}
      </div>
   );
}

function Task({ tag, onChange }) {
   if (!["DONE", "TODO"].includes(tag)) return;

   return (
      <div className="flex gap-2">
         <input type="checkbox" checked={tag === "DONE"} onClick={onChange} />
         <p>{tag}</p>
      </div>
   );
}

function Schedule({ schedule, onChange }) {
   if (!schedule) return;

   const date = schedule ? new Date(schedule) : new Date();

   return (
      <div className="border">
         <p>Scheduled</p>
         <input type="date" value={dateForPicker(date)} onChange={onChange} />
         <input type="time" value={timeForPicker(date)} />
      </div>
   );
}

function Deadline({ deadline, onChange }) {
   const date = deadline ? new Date(deadline) : new Date();

   return (
      <div className="border">
         <p>Deadline</p>
         <input type="date" value={dateForPicker(date)} onChange={onChange} />
         <input type="time" value={timeForPicker(date)} />
      </div>
   );
}

function pad(string) {
   return String(string).padStart(2, "0");
}

function dateForPicker(date) {
   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
   )}`;
}

function timeForPicker(date) {
   return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default App;
