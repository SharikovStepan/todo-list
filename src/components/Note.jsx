import Checkbox from "./Checkbox";
import Button from "./Button";
import { motion } from "motion/react";
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

  const deleteNote = () => {
    props.onDelete(props.id);
  };
  //  const colorPrimary = "var(--color-primary)";
  const colorPrimary = "#f00";

  const variants = {
    tap: {
      scale: 1.01,
      border: `1px solid var(--color-primary)`,
      transition: { duration: 0.1, type: "tween", ease: "linear" },
    },
    hover: {
      scale: 1.01,
      border: `1px solid var(--color-primary)`,
      transition: { duration: 0.15, type: "tween", ease: "linear" },
    },
    default: {
      scale: 1,
      border: `1px solid transparent`,
      transition: { duration: 0.3, type: "tween", ease: "linear" },
    },
  };

  return (
    <>
      <motion.div
        variants={variants}
        animate="default"
        whileHover="hover"
        whileTap="tap"
        id={props.id}
        onClick={props.onClick}
        className={`py-1 px-1 sm:px-2 sm:py-2 cursor-pointer will-change-transform border hover-note rounded-md flex justify-between items-center gap-2 ${props.bgColor} `}>
        <Checkbox id={`${props.id}-checkbox`} checked={isThrough} onChange={handleCheck} />
        <div className=" w-full flex flex-col">
          <h2 className={`text-xs font-bold sm:text-lg sm:font-medium ${isThrough ? "line-through" : ""}`}>{props.children}</h2>
          {props.sortNum == "3" ? (
            <h3 className="text-xs font-thin sm:font-normal">{`cоздана: ${props.dateCreate}`}</h3>
          ) : (
            <h3 className="text-xs font-thin sm:font-normal">{`изменена: ${props.dateChange}`}</h3>
          )}
        </div>

        <div onClick={deleteNote} className="flex justify-center items-center">
          <Button isLayout={false} className={`bg-secondary-bg hover-button w-8 h-8 p-1`}>
            <img className="w-full h-full" src="images/trash.png" alt="trash" />
          </Button>
        </div>
      </motion.div>
    </>
  );
}
export default Note;
