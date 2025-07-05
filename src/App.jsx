import { useState } from "react";
import "./App.css";
import Button from "./components/Button";
import Note from "./components/Note";
import { getLocalNotes } from "./utils/getLocalNotes";
import AddNoteModal from "./components/AddNoteModal";
import BlurMask from "./components/BlurMask";
import OptionList from "./components/OptionList";
import { sortTags } from "./utils/sortTags";
import { sortNotes } from "./utils/sortNotes";
import { checkUniqueTags } from "./utils/checkUniqueTags";
import Search from "./components/Search";

const SORTING_KEYS = [
  { id: "1", name: "Имя" },
  { id: "2", name: "Приоритет" },
  { id: "3", name: "Дата создания" },
  { id: "4", name: "Дата изменения" },
];

const DEFAULT_TAG = { id: 0, name: "Все теги" };

function App() {
  const [sort, setSort] = useState(localStorage.getItem("sort") || "4");
  const [notesData, setNotesData] = useState(getLocalNotes(sort));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [noteToEdit, setNoteToEdit] = useState("");
  const [sortDirection, setSortDirection] = useState(localStorage.getItem("sortDirection") || 1);

  const [tag, setTag] = useState(localStorage.getItem("tag") || 0);

  const filterNotesByTag = (tagNum, direction) => {
    if (tagNum == "0" || !tagNum) return getLocalNotes(sort, direction);

    return getLocalNotes(sort, direction).filter((note) => note.tag === tagNum);
  };

  const changeTag = (e) => {
    let tagNum;
    try {
      tagNum = e.target.value;
      if (tagNum) {
        localStorage.setItem("tag", tagNum);
      } else {
        throw new Error("side generating");
      }
    } catch (error) {
      tagNum = 0;
    }

    setTag(tagNum);
    localStorage.setItem("tag", tagNum);

    console.log("смена тега");

    if (searchText == "") {
      setNotesData(filterNotesByTag(tagNum, sortDirection));
    } else {
      getSearchData(searchText, tagNum);
    }
  };

  const changeSort = (e, direction = sortDirection) => {
    let sortNum;
    try {
      sortNum = e.target.value;
      if (sortNum) {
        localStorage.setItem("sort", sortNum);
      } else {
        throw new Error("side generating");
      }
    } catch (error) {
      sortNum = sort;
    }

    setSort(sortNum);
    setNotesData((prev) => {
      return sortNotes([...prev], sortNum, direction);
    });
  };

  const changeSortDirection = (e) => {
    changeSort(e, sortDirection * -1);
    localStorage.setItem("sortDirection", sortDirection * -1);
    setSortDirection((prev) => prev * -1);
  };

  const [tags, setTags] = useState(() => {
    const uniqueTagsArr = checkUniqueTags(notesData);

    localStorage.setItem("tag", tag);
    localStorage.setItem("sort", sort);
    localStorage.setItem("sortDirection", sortDirection);

    setNotesData(filterNotesByTag(tag, sortDirection));

    return sortTags([DEFAULT_TAG, ...uniqueTagsArr]);
  });

  const addNewNote = (newNote) => {
    localStorage.setItem(newNote.noteId, JSON.stringify(newNote));

    const uniqueTagsArr = checkUniqueTags(getLocalNotes());

    const sortedTags = sortTags(uniqueTagsArr);

    const isTag = sortedTags.some((tagObj) => tagObj.id == tag);
    if (tag != "0" && !isTag) {
      changeTag();
    } else {
      setNotesData(filterNotesByTag(tag, sortDirection));
    }

    setTags([DEFAULT_TAG, ...sortedTags]);

    setIsModalOpen(false);
  };

  const editNote = (e) => {
    const notee = notesData.filter((note) => note.noteId == e.currentTarget.id);

    if (e.target.closest("button")) {
      localStorage.removeItem(notee[0].noteId);

      if (searchText == "") {
        setNotesData(filterNotesByTag(tag, sortDirection));
      } else {
        getSearchData(searchText);
      }

      const uniqueTagsArr = checkUniqueTags(getLocalNotes());

      const sortedTags = sortTags(uniqueTagsArr);

      const isTag = sortedTags.some((tagObj) => tagObj.id == tag);

      if (tag != "0" && !isTag) {
        changeTag();
        setTags([DEFAULT_TAG, ...sortedTags]);
      }
    } else if (!e.target.closest("label")) {
      setNoteToEdit(...notee);
      setIsModalOpen(true);
    }
  };

  const getSearchData = (searchData, tagNum = tag) => {
    setSearchText(searchData);
    const allNotes = filterNotesByTag(tagNum, sortDirection);

    const searchedNotes = allNotes.filter((note) => {
      const noteText = `${note.name} ${note.text}`.toLowerCase();
      return noteText.includes(searchData.toLowerCase());
    });
    setNotesData(searchedNotes);
  };

  const switchSearchStatus = (isSearch) => {
    if (isSearch) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
      getSearchData("");
      setSearchText("");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-2xs sm:w-xl md:w-2xl">
        {isModalOpen && <BlurMask />}
        <h1 className="font-bold text-3xl mx-auto">To DO LIST</h1>
        <div className="flex justify-between gap-8 sm:gap-4 items-end sm:grid sm:grid-cols-3">
          <div className="absolute top-2 left-2 sm:relative sm:top-0 sm:left-0 sm:justify-self-start">
            <Button
              onClick={() => switchSearchStatus(!isSearchOpen)}
              className={["bg-primary-bg", "hover:bg-secondary", "border-2", "border-primary", "w-10", "h-8", "rounded-[50%]", "flex", "justify-center", "items-center", "sm:w-15", "sm:h-10"]}>
              <img className="h-full" src="images/search.png" alt="search" />
            </Button>
            {isSearchOpen && <Search onClick={() => switchSearchStatus(false)} onChangeSearchInput={getSearchData} />}
          </div>
          <div className="justify-self-start sm:justify-self-center">
            <Button
              onClick={() => {
                setNoteToEdit("");
                setIsModalOpen(true);
              }}
              className={["bg-primary", "text-zinc-700", "hover:bg-secondary", "text-xs", "w-20", "h-6", "sm:w-30", "sm:h-10", "sm:text-base"]}>
              Добавить
            </Button>
          </div>
          <div className="relative flex grow justify-between gap-2">
            <div className="flex-[0_0_49%] gap-1 text-xs sm:text-sm">
              <OptionList optionName="sort" value={sort} options={SORTING_KEYS} onChange={changeSort}>
                Сортировать
              </OptionList>
              <Button
                onClick={changeSortDirection}
                className={[
                  "flex",
                  "justify-center",
                  "bottom-0",
                  "left-0",
                  "absolute",
                  "bg-primary-bg",
                  "sm:h-5",
                  "hover:bg-secondary",
                  "border",
                  "border-primary",
                  "w-5",
                  "h-4.5",
                  "text-xs",
                  "-translate-x-[calc(100%+4px)]",
                ]}>
                <img className="h-full" src="images/sorting.png" alt="sorting" />
              </Button>
            </div>
            <div className="flex-[0_0_49%] text-xs sm:text-sm">
              <OptionList optionName="tags" value={tag} options={tags} onChange={changeTag}>
                Тег
              </OptionList>
            </div>
          </div>
        </div>
        <div className="rounded-2xl py-2 px-2 sm:py-5 sm:px-5 bg-secondary-bg flex flex-col gap-2">
          {notesData.length > 0 ? (
            notesData.map((note) => {
              return (
                <Note
                  sortNum={sort}
                  onClick={editNote}
                  bgColor={`bg-note-${note.priority}`}
                  checked={note.checked}
                  dateChange={note.dateChange}
                  dateCreate={note.dateCreate}
                  key={note.noteId}
                  id={note.noteId}>
                  {note.name}{" "}
                </Note>
              );
            })
          ) : (
            <div className="text-base sm:text-lg text-center">{isSearchOpen ? "Измените фильтры" : "Добавьте первую заметку"}</div>
          )}
        </div>
      </div>
      {isModalOpen && <AddNoteModal noteToEdit={noteToEdit} onSave={addNewNote} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default App;
