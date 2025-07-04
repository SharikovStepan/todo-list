import Checkbox from "./Checkbox";
import Button from "./Button";

import { useState } from "react";

function Note(props) {
  const [isThrough, setIsThrough] = useState(props.checked);

  const handleCheck = (e) => {
    const notesId = e.target.id.slice(0, -9);
    const currNoteData = JSON.parse(localStorage.getItem(`${notesId}`));
    currNoteData.checked = !currNoteData.checked;
    localStorage.setItem(notesId, JSON.stringify(currNoteData));

    setIsThrough(e.target.checked);
  };

  return (
    <>
      <div
        id={props.id}
        onClick={props.onClick}
        className={`py-1 px-1 sm:px-2 sm:py-2 cursor-pointer transition-all will-change-contents border border-transparent hover:border-primary hover:transform-flat hover:scale-[1.01] rounded-md flex justify-between items-center gap-2 ${props.bgColor} `}>
        <Checkbox id={`${props.id}-checkbox`} checked={isThrough} onChange={handleCheck} />
        <div className=" w-full flex flex-col">
          <h2 className={`text-xs font-bold sm:text-lg sm:font-medium ${isThrough ? "line-through" : ""}`}>{props.children}</h2>
          {props.sortNum == "3" ? (
            <h3 className="text-xs font-thin sm:font-normal">{`cоздана: ${props.dateCreate}`}</h3>
          ) : (
            <h3 className="text-xs font-thin sm:font-normal">{`изменена: ${props.dateChange}`}</h3>
          )}
        </div>

        <div className="flex gap-1">
          {/* <Button className={["bg-secondary-bg", "hover:bg-secondary", "w-8", "h-8", "p-2"]}>
            <img className="w-full h-full" src="images/pencil.png" alt="pencil" />
          </Button> */}

          <Button className={["bg-secondary-bg", "hover:bg-secondary", "w-8", "h-8", "p-2"]}>
            <img className="w-full h-full" src="images/trash.png" alt="trash" />
          </Button>
        </div>
      </div>
    </>
  );
}
export default Note;
