import { useEffect, useReducer, useState } from "react";
import { getLocalNotes } from "../utils/getLocalNotes";
import Button from "./Button";
import OptionList from "./OptionList";
import { PRIORITY_OPTIONS } from "../utils/consts";
import { motion, AnimatePresence } from "motion/react";
import { div } from "motion/react-client";
import { animate } from "motion";

function reducer(state, action) {
  switch (action.type) {
    case "name":
      return { ...state, name: action.value };
    case "text":
      return { ...state, text: action.value };
    case "tag":
      return { ...state, tag: action.value != "" ? action.value : "no-tag" };
    case "priority":
      return { ...state, priority: action.value };
  }
}

function EditNote(props) {
  const editingNote = props.noteToEdit || { name: "", text: "", tag: "no-tag", priority: 1 };

  const [noteState, dispatchNote] = useReducer(reducer, editingNote);

  const [isEdited, setIsEdited] = useState(false);

  const localNotes = getLocalNotes();

  let noteId;
  const dates = {};
  const nowTimestamp = Date.now();
  const nowDate = new Date().toLocaleString("ru-RU");

  if (!editingNote.noteId) {
    try {
      const lastId = localNotes[localNotes.length - 1].noteId.slice(5);
      noteId = `note_${+lastId + 1}`;
    } catch (error) {
      noteId = `note_1`;
    }
    dates.create = nowDate;
    dates.createTimestamp = nowTimestamp;
    dates.change = nowDate;
    dates.changeTimestamp = nowTimestamp;
  } else {
    noteId = editingNote.noteId;

    dates.create = editingNote.dateCreate;
    dates.createTimestamp = editingNote.timestampCreate;
    dates.change = nowDate;
    dates.changeTimestamp = nowTimestamp;
  }

  //   const tags = ["TAG1", "TAG2", "qweqwe"];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNote = {
      noteId: noteId,
      name: noteState.name,
      text: noteState.text,
      dateCreate: dates.create,
      timestampCreate: dates.createTimestamp,
      dateChange: dates.change,
      timestampChange: dates.changeTimestamp,
      tag: noteState.tag.toLowerCase().replace(/\s+/g, "_"),
      priority: noteState.priority,
      checked: false,
    };
    props.onSave(newNote);
    console.log("Запись");
  };

  const closeModal = () => {
    props.onClose();
    console.log("Отмена");
  };

  console.log("editingNote", editingNote);

  useEffect(() => {
    if (editingNote.name != noteState.name || editingNote.text != noteState.text || editingNote.tag != noteState.tag || editingNote.priority != noteState.priority) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [noteState]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.90 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.15, type: "spring", damping: 10, stiffness: 70, bounce: 0.45 } }}
        exit={{ opacity: 0, scale: 0.90 }}
        className="modal flex flex-col">
        <form className="grid grid-rows-[auto_1fr_auto] gap-y-1 text-xs flex-1" action="#" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name">Название:</label>
            <div className="border grow border-secondary rounded-sm">
              <input
                className="input text-xl"
                id="name"
                name="name"
                autoComplete="off"
                type="text"
                onChange={(e) => dispatchNote({ type: "name", value: e.target.value })}
                defaultValue={noteState.name}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="discription">Описание:</label>
            <div className="border grow border-secondary rounded-sm">
              <textarea
                className="p-1 input resize-none"
                id="discription"
                name="discription"
                defaultValue={noteState.text}
                onChange={(e) => dispatchNote({ type: "text", value: e.target.value })}></textarea>
            </div>
          </div>

          <div className={`flex flex-col ${editingNote.timestampCreate ? "block" : "hidden"}`}>
            <p className="text-end">{`создана: ${editingNote.dateCreate}`}</p>
            <p className="text-end">{`изменена: ${editingNote.dateChange}`}</p>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex flex-col-reverse sm:flex-row gap-1 sm:gap-3">
              <div>
                <label htmlFor="tag">ТЕГ</label>
                <div className="border border-secondary rounded-sm">
                  <input
                    placeholder="Без тега"
                    className="px-1 placeholder:pl-0.5 focus:outline-2 focus:outline-primary rounded-sm"
                    id="tag"
                    name="tag"
                    type="text"
                    autoComplete="off"
                    list="tag-list"
                    onChange={(e) => dispatchNote({ type: "tag", value: e.target.value })}
                    value={noteState.tag === "no-tag" ? "" : noteState.tag}
                  />
                  {/* <datalist id="tag-list">
                    {tags.map((item) => {
                      <option key={item} value={item} />;
                    })}
                  </datalist> */}
                </div>
              </div>

              <OptionList
                optionName={"priority"}
                onChange={(e) => {
                  dispatchNote({ type: "priority", value: e.target.value });
                }}
                options={PRIORITY_OPTIONS}
                value={noteState.priority}>
                Приоритет
              </OptionList>
            </div>

            <div className="flex flex-col justify-end sm:flex-row sm:items-center justify-self-end min-w-18">
              <AnimatePresence>
                <div key="back-button" className="flex justify-center items-center">
                  <Button type="button" onClick={closeModal} className={`bg-primary w-full sm:w-20 text-xs text-zinc-800`}>
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={isEdited ? "cancel" : "back"}>
                      {isEdited ? "Отменить" : "Выйти"}
                    </motion.span>
                  </Button>
                </div>
                {isEdited && (
                  <motion.div className="flex justify-center items-center" key="save-button" initial={{ width: 0 }} animate={{ width: "100%", marginLeft: 10 }} exit={{ width: 0, marginLeft: 0 }}>
                    <Button type="submit" className={`bg-primary w-full sm:w-20 text-xs text-zinc-800`}>
                      Сохранить
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
}
export default EditNote;
