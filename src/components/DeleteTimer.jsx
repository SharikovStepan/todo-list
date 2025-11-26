import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function DeleteTimer({ noteIdToDeleted, deleteResult }) {
  const [isCanceled, setIsCanceled] = useState(false);
  const progressBar = useRef(null);
  const timeoutRef = useRef(null);
  useEffect(() => {
    progressBar.current.style.width = "0%";

    timeoutRef.current = setTimeout(() => {
      console.log("DELETED");
      deleteResult(true, noteIdToDeleted);
    }, 5200);

    return () => {
      console.log("cleartimeouttimeout");
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const cancelDelete = () => {
    deleteResult(false, noteIdToDeleted);
    setIsCanceled(true);
    clearTimeout(timeoutRef.current);
  };

  return (
    <>
      <motion.button
        animate={{ opacity: 1, scale: 1, y: 0, boxShadow: "0px 0px 20px #000, 0px 0px 0px #000 inset" }}
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        exit={{ opacity: 0, scale: 1.01, y: isCanceled ? -20 : 20, transition: { duration: 0.3 } }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        whileTap={{ boxShadow: "0px 0px 10px #000, 0px 0px 5px #000 inset", scale: 0.99, transition: { duration: 0.1 } }}
        onClick={cancelDelete}
        className="timer flex flex-col">
        <div className="flex justify-between">
          <p>Заметка удалена.</p>
          <p>Отменить?</p>
        </div>
        <div className="w-full relative">
          <div ref={progressBar} style={{ width: "100%" }} className="absolute top-1 left-0 bg-primary h-1 rounded-md transition-all duration-5000 ease-linear"></div>
        </div>
      </motion.button>
    </>
  );
}
export default DeleteTimer;
