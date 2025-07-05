import { useState } from "react";
import { getLocalNotes } from "../utils/getLocalNotes";
import Button from "./Button";
import OptionList from "./OptionList";

function AddNoteModal(props) {
  const editingNote = props.noteToEdit || {};

  const [noteName, setNoteName] = useState(editingNote.name || "");
  const [noteText, setNoteText] = useState(editingNote.text || "");

  const [noteTag, setNoteTag] = useState(editingNote.tag || "no-tag");
  const [notePriority, setNotePriority] = useState(editingNote.priority || 1);

  const optionsPriority = [
    { id: 3, name: "Высокий" },
    { id: 2, name: "Средний" },
    { id: 1, name: "Обычный" },
    { id: 0, name: "Низкий" },
  ];

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

  const tags = ["TAG1", "TAG2", "qweqwe"];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNote = {
      noteId: noteId,
      name: noteName,
      text: noteText,
      dateCreate: dates.create,
      timestampCreate: dates.createTimestamp,
      dateChange: dates.change,
      timestampChange: dates.changeTimestamp,
      tag: noteTag.toLowerCase().replace(/\s+/g, "_"),
      priority: notePriority,
      checked: false,
    };
    props.onSave(newNote);
    console.log("Запись");
  };

  const closeModal = () => {
    props.onClose();
    console.log("Отмена");
  };

  return (
    <>
      <form action="#" onSubmit={handleSubmit}>
        <div className="absolute top-10 left-1/2 z-20 border border-black -translate-x-1/2 p-2 rounded-md bg-primary-bg w-xs sm:w-lg md:w-xl min-h-2/3 grid grid-rows-[0.7fr_4fr_0.5fr] gap-y-1 text-xs">
          <div className="flex flex-col">
            <label htmlFor="name">Название:</label>
            <div className="border grow border-secondary rounded-sm">
              <input
                className="w-full h-full px-1 focus:outline-2 focus:outline-primary rounded-sm text-xl"
                id="name"
                name="name"
                autoComplete="off"
                type="text"
                onChange={(e) => setNoteName(e.target.value)}
                defaultValue={noteName}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="discription">Описание:</label>
            <div className="border grow border-secondary rounded-sm">
              <textarea
                className="p-1 w-full h-full focus:outline-2 focus:outline-primary rounded-sm resize-none"
                id="discription"
                name="discription"
                defaultValue={noteText}
                onChange={(e) => setNoteText(e.target.value)}></textarea>
            </div>
          </div>

          <div className={`flex flex-col ${editingNote.tag ? "block" : "hidden"}`}>
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
                    onChange={(e) => setNoteTag(e.target.value)}
                    value={noteTag === "no-tag" ? "" : noteTag}
                  />
                  <datalist id="tag-list">
                    {tags.map((item) => {
                      <option key={item} value={item} />;
                    })}
                  </datalist>
                </div>
              </div>

              <OptionList
                optionName={"priority"}
                onChange={(e) => {
                  setNotePriority(e.target.value);
                }}
                options={optionsPriority}
                value={notePriority}>
                Приоритет
              </OptionList>
            </div>
            <div className="flex flex-col justify-center sm:flex-row sm:items-center justify-self-end gap-1 sm:gap-6">
              <Button type="button" onClick={closeModal} className={["bg-primary", "hover:bg-secondary", "h-8", "sm:w-20", "text-xs", "px-1", " text-zinc-800"]}>
                Отменить
              </Button>
              <Button type="submit" className={["bg-primary", "hover:bg-secondary", "h-8", "sm:w-20", "text-xs", "px-1", " text-zinc-800"]}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
export default AddNoteModal;
