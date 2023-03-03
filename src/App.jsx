import React, { useState, useEffect, useRef } from "react";
import getParsed from "./api/getParsed";
import getStringify from "./api/getStringify";
import { timeForPicker } from "./utils/timeForPicker";
import { dateForPicker } from "./utils/dateForPicker";
import { remainingDays } from "./utils/remainingDays";

function App() {
   const [text, setText] = useState(localStorage.getItem("text") ?? "");
   const [parsed, setParsed] = useState(null);
   const rootRef = useRef({});

   useEffect(() => {
      // if (!text) return setParsed(null);
      handleParsing(text);
      localStorage.setItem("text", text ?? "");
   }, [text]);

   async function handleParsing(text) {
      const body = getParsed(text);
      rootRef.current = body;
      setParsed(body);
   }

   async function handleTreeChange() {
      const body = getStringify(rootRef.current);
      setText(body);
   }

   return (
      <div className="pb-4 max-w-lg mx-auto">
         <h1 className="text-white font-bold text-lg p-4 pt-2">
            {new Date().toLocaleDateString()}
         </h1>
         <main className="bg-gray-500 p-4 flex flex-col gap-6">
            <TextArea
               value={text}
               onChange={event => setText(event.target.value)}
            />
            {text && (
               <Visualizer root={rootRef.current} onChange={handleTreeChange} />
            )}
         </main>
      </div>
   );
}

const componentsMap = [
   {
      description: "Document",
      match: root => ["HEADER"].includes(root.tag),
      component: Document,
   },
   {
      description: "Task",
      match: root => ["TODO", "DONE"].includes(root.tag),
      component: Task,
   },
   {
      description: "Root",
      match: root => ["ROOT"].includes(root.tag),
      component: Root,
   },
   {
      description: "Not found",
      match: () => true,
      component: Document,
   },
];

function Visualizer({ root, parent, onChange }) {
   let Component = componentsMap.find(el => el.match(root))?.component;

   return (
      Component && <Component root={root} parent={parent} onChange={onChange} />
   );
}

function Text({ children }) {
   return (
      <p className="text-gray-500 pb-4 whitespace-pre-line">
         {children.trim()}
      </p>
   );
}

function TextArea({ value, onChange }) {
   return (
      <textarea
         className="min-h-[10rem] min-w-[20rem] resize-y outline-none caret-gray-50 bg-gray-500 h-full text-gray-50"
         value={value}
         onChange={onChange}
         placeholder="Start typing..."
      />
   );
}

function Root({ root, onChange }) {
   return (
      <div className="flex-1 bg-gray-200 rounded-lg shadow-sm px-3 py-4 grid gap-6 pb-6">
         {root.text && <Text>{root.text}</Text>}
         {root.children &&
            root?.children.map(child => (
               <Visualizer root={child} parent={root} onChange={onChange} />
            ))}
      </div>
   );
}

function Document({ root, onChange }) {
   const [open, setOpen] = useState(true);

   let childTags = root.children?.map(child => child.tag);
   let activeNestedTasks = childTags?.filter(
      childTag => childTag === "TODO" || childTag === "DONE"
   );
   let activeNestedDone = childTags?.filter(childTag => childTag === "DONE");
   let completionPercentage = Math.round(
      (activeNestedDone?.length / activeNestedTasks?.length) * 100
   );

   return (
      <div className="bg-white border-2 grid gap-2 p-3 rounded-xl">
         <div className="flex gap-2 items-center justify-between">
            <h1
               onClick={() => setOpen(prev => !prev)}
               className="font-bold text-xl"
            >
               {root.tagText}
            </h1>
            {completionPercentage < 100 && (
               <Completion value={completionPercentage} />
            )}
         </div>

         {open && (
            <div>
               {root.text && <Text>{root.text}</Text>}
               {root?.children &&
                  root.children.map(child => (
                     <Visualizer
                        root={child}
                        parent={root}
                        onChange={onChange}
                     />
                  ))}
            </div>
         )}
      </div>
   );
}

function Task({ root, onChange }) {
   const [open, setOpen] = useState(true);

   let todo = root.tag === "TODO";
   let done = root.tag === "DONE";

   let childTags = root.children?.map(child => child.tag);
   let activeNestedTasks = childTags?.filter(
      childTag => childTag === "TODO" || childTag === "DONE"
   );
   let activeNestedDone = childTags?.filter(childTag => childTag === "DONE");
   let completionPercentage = Math.round(
      (activeNestedDone?.length / activeNestedTasks?.length) * 100
   );

   function toggleStatus() {
      if (root.tag === "TODO") {
         root.tag = "DONE";
      } else {
         root.tag = "TODO";
      }
      onChange();
   }

   function handleScheduleChange(event) {
      const date = new Date(event.target.value);
      if (isNaN(date)) return;
      root.schedule = date;
      onChange();
   }

   function handleDeadlineChange(event) {
      const date = new Date(event.target.value);
      if (isNaN(date)) return;
      root.deadline = date;
      onChange();
   }

   return (
      <div
         className={`bg-white grid gap-2 border-2 p-2 rounded-xl ${
            todo && "border-orange-500 shadow-sm"
         }`}
      >
         <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
               <Checkbox checked={done} onClick={toggleStatus} />
               <h1
                  onClick={() => setOpen(prev => !prev)}
                  className="font-bold text-lg"
               >
                  {root.tagText}
               </h1>
            </div>
            {completionPercentage < 100 && (
               <Completion value={completionPercentage} />
            )}
         </div>

         {open && (
            <div>
               {(root.schedule || root.deadline) && (
                  <div className="grid gap-2 grid-cols-2">
                     {root.schedule && (
                        <Schedule
                           disabled={done}
                           schedule={root.schedule}
                           onChange={handleScheduleChange}
                        />
                     )}

                     {root.deadline && (
                        <Deadline
                           disabled={done}
                           deadline={root.deadline}
                           onChange={handleDeadlineChange}
                        />
                     )}
                  </div>
               )}

               {root.text?.trim() && <Text>{root.text}</Text>}

               {root?.children &&
                  root.children.map(child => (
                     <Visualizer
                        root={child}
                        parent={root}
                        onChange={onChange}
                     />
                  ))}
            </div>
         )}
      </div>
   );
}

function Completion({ value }) {
   return (
      <div>
         {!isNaN(value) && (
            <span className="border-2 rounded-xl text-gray-500 px-2">
               {value}%
            </span>
         )}
      </div>
   );
}

function DateTime({
   date,
   title = "Time and date",
   onChange,
   className = "bg-blue-500",
   disabled,
}) {
   return (
      <div className="text-xs rounded-lg overflow-hidden text-white shadow-sm">
         <div
            style={{ height: "100%" }}
            className={disabled ? "bg-gray-400" : className}
         >
            <div className="px-2 py-1">
               <p className="font-bold">{title}</p>
               <input
                  className="text-[.65rem]"
                  type="datetime-local"
                  value={dateForPicker(date)}
                  onChange={onChange}
               />
            </div>
         </div>
      </div>
   );
}

function Schedule({ schedule, onChange, disabled }) {
   const date = schedule ? new Date(schedule) : new Date();

   return (
      <DateTime
         disabled={disabled}
         title="Scheduled"
         date={date}
         onChange={onChange}
      />
   );
}

function Deadline({ deadline, onChange, disabled }) {
   const date = deadline ? new Date(deadline) : new Date();
   const daysLeft = remainingDays(deadline);

   return (
      <DateTime
         disabled={disabled}
         title={`Deadline${daysLeft >= 0 ? ` in ${daysLeft} days` : ""}`}
         className="bg-orange-500"
         date={date}
         onChange={onChange}
      />
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
            className={`border-2 border-orange-500 absolute top-0 left-0 rounded-full w-5 h-5 grid place-items-center ${checkboxStyle}`}
         >
            <div
               className={`w-2.5 h-2.5 rounded-full bg-orange-500 ${
                  !checked ? "opacity-0" : "opacity-100"
               }`}
            />
         </div>
      </div>
   );
}

export default App;
