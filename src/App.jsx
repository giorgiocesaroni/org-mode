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

   let todo = root.tag === "TODO";
   let childTags = root.children?.map(child => child.tag);
   let hasTodos = childTags?.includes("TODO");

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

   let rootStyle = "bg-white text-gray-900";
   let headerTextStyle = "";

   let disabled = root.tag === "DONE" || hasTodos;

   if (disabled) {
      rootStyle = "bg-gray-100";
      headerTextStyle = "opacity-50";
   } else if (todo) {
      rootStyle = "border-orange-400 bg-white shadow";
   }

   return (
      <div
         className={`flex border-2 flex-col gap-2 p-3 rounded-2xl ${rootStyle}`}
      >
         {root.tag !== "ROOT" && (
            <header
               onClick={handleTaskChange}
               className="flex items-center gap-2 font-bold text-xl"
            >
               <Task
                  disabled={hasTodos || parent?.tag === "DONE"}
                  tag={root.tag}
               />
               <h1 class={headerTextStyle}>{root.tagText}</h1>
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
      <Checkbox
         disabled={disabled}
         checked={tag === "DONE"}
         onClick={onChange}
      />
   );
}

function Schedule({ schedule, onChange }) {
   if (!schedule) return;

   const date = schedule ? new Date(schedule) : new Date();

   return (
      <div className="text-gray-500 mb-2 flex flex-col">
         <p>Scheduled</p>
         <div className="flex gap-2">
            <input
               type="date"
               value={dateForPicker(date)}
               onChange={onChange}
            />
            <input type="time" value={timeForPicker(date)} />
         </div>
      </div>
   );
}

function Deadline({ deadline, onChange }) {
   if (!deadline) return;

   const date = deadline ? new Date(deadline) : new Date();

   return (
      <div className="text-gray-500 mb-2 flex flex-col">
         <p>Deadline</p>
         <div className="flex gap-2">
            <input
               type="date"
               value={dateForPicker(date)}
               onChange={onChange}
            />
            <input type="time" value={timeForPicker(date)} />
         </div>
      </div>
   );
}

function Checkbox({ disabled, checked, onClick }) {
   let checkboxStyle = "opacity-100";

   if (disabled) {
      checkboxStyle = "opacity-30";
   }

   return (
      <div
         onClick={!disabled ? onClick : null}
         className="flex relative w-5 h-5"
      >
         <div
            className={`border-2 border-gray-500 absolute top-0 left-0 rounded-full w-5 h-5 grid place-items-center ${checkboxStyle}`}
         >
            <div
               className={`w-2.5 h-2.5 rounded-full bg-gray-500 ${
                  !checked ? "opacity-0" : "opacity-100"
               }`}
            />
         </div>
      </div>
   );
}

export default App;
