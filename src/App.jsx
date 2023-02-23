import React, { useState, useEffect, useRef } from "react";
import getParsed from "./api/getParsed";

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

   return (
      <main className="border p-4 grid grid-cols-2 gap-2">
         <TextArea
            value={text}
            onChange={event => setText(event.target.value)}
         />
         <Visualizer
            root={rootRef.current}
            onChange={() => console.log("Changed", rootRef.current)}
         />
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

   function handleTaskChange() {
      if (root.tag === "TODO") {
         root.tag = "DONE";
      } else {
         root.tag = "TODO";
      }

      onChange();
   }

   return (
      <div className="border p-2">
         <Task tag={root.tag} onChange={handleTaskChange} />
         <h1>{root.tagText}</h1>
         <p className="mb-4">{root.text}</p>
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

export default App;
