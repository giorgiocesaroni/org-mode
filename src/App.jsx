import React, { useState, useEffect, useRef } from "react";
import getParsed from "./api/getParsed";
import getStringify from "./api/getStringify";
import { timeForPicker } from "./utils/timeForPicker";
import { dateForPicker } from "./utils/dateForPicker";

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
         className="border bg-slate p-2 h-full"
         value={value}
         onChange={onChange}
      />
   );
}

function Visualizer({ root, parent, onChange }) {
   if (!root) return;

   let childTags = root.children?.map(child => child.tag);

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
      <div
         className={`flex flex-col gap-2 border p-2 rounded-2xl ${
            root.tag === "DONE"
               ? "bg-gray-100 text-gray-500"
               : "bg-white text-gray-900"
         }`}
      >
         {root.tag !== "ROOT" && (
            <header className="flex gap-2 mb-2 font-bold">
               <Task
                  disabled={
                     childTags?.includes("TODO") || parent.tag === "DONE"
                  }
                  tag={root.tag}
                  onChange={handleTaskChange}
               />
               <h1>{root.tagText}</h1>
            </header>
         )}
         <Schedule schedule={root.schedule} onChange={handleScheduleChange} />
         <Deadline deadline={root.deadline} onChange={handleDeadlineChange} />
         {root.text?.trim() && (
            <p className="mb-4 whitespace-pre-wrap text-gray-500">
               {root.text?.trim()}
            </p>
         )}
         {root.children?.map(child => (
            <Visualizer root={child} parent={root} onChange={onChange} />
         ))}
      </div>
   );
}

function Task({ tag, onChange, disabled }) {
   if (!["DONE", "TODO"].includes(tag)) return;

   return (
      <div className="flex gap-2">
         <input
            disabled={disabled}
            type="checkbox"
            checked={tag === "DONE"}
            onClick={onChange}
         />
         {/* <p>{tag}</p> */}
      </div>
   );
}

function Schedule({ schedule, onChange }) {
   if (!schedule) return;

   const date = schedule ? new Date(schedule) : new Date();

   return (
      <div className="">
         <p>Scheduled</p>
         <input type="date" value={dateForPicker(date)} onChange={onChange} />
         <input type="time" value={timeForPicker(date)} />
      </div>
   );
}

function Deadline({ deadline, onChange }) {
   if (!deadline) return;

   const date = deadline ? new Date(deadline) : new Date();

   return (
      <div className="">
         <p>Deadline</p>
         <input type="date" value={dateForPicker(date)} onChange={onChange} />
         <input type="time" value={timeForPicker(date)} />
      </div>
   );
}

export default App;
