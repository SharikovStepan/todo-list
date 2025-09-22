import { useReducer, useState } from "react";
import "./App.css";
import Button from "./components/Button";
import Note from "./components/Note";
import { getLocalNotes } from "./utils/getLocalNotes";
import EditNote from "./components/EditNote";
import BlurMask from "./components/BlurMask";
import OptionList from "./components/OptionList";
import { sortTags } from "./utils/sortTags";
import { sortNotes } from "./utils/sortNotes";
import { checkUniqueTags } from "./utils/checkUniqueTags";
import Search from "./components/Search";
import { DEFAULT_TAG, SORTING_KEYS } from "./utils/consts";
import LogIn from "./components/LogIn";
import UserName from "./components/UserName";
import UserInfo from "./components/UserInfo";

function uiStateReducer(state, action) {
  switch (action.type) {
    case "isNoteEdit":
      return { ...state, isNoteEdit: action.value };
    case "isSearch":
      return { ...state, isSearch: action.value };
    case "isSignUp":
      return { ...state, isSignUp: action.value };
    case "isLogIn":
      return { ...state, isLogIn: action.value };
  }
}

function sortReducer(state, action) {
  switch (action.type) {
    case "sortType":
      return { ...state, sortType: action.value };
    case "sortDirection":
      return { ...state, sortDirection: action.value };
    case "currentTag":
      return { ...state, currentTag: action.value };
    case "searchText":
      return { ...state, searchText: action.value };
  }
}

const initialUiState = {
  isNoteEdit: false,
  isSearch: false,
  isSignUp: false,
  isLogIn: false,
};

const initialSortState = {
  sortType: localStorage.getItem("sortType") || "4",
  currentTag: localStorage.getItem("tag") || 0,
  sortDirection: localStorage.getItem("sortDirection") || 1,
  searchText: "",
};

function App() {
  const [isLogined, setIsLogined] = useState(false);

  const [sortState, dispatchSort] = useReducer(sortReducer, initialSortState);

  const [uiState, dispatchUiState] = useReducer(uiStateReducer, initialUiState);

  const [userData, setUserData] = useState({});

  const [notesData, setNotesData] = useState(getLocalNotes(sortState.sortType));

  const [noteToEdit, setNoteToEdit] = useState("");

  const filterNotesByTag = (tagNum, direction) => {
    if (tagNum == "0" || !tagNum) return getLocalNotes(sortState.sortType, direction);

    return getLocalNotes(sortState.sortType, direction).filter((note) => note.tag === tagNum);
  };

  const [tags, setTags] = useState(() => {
    const uniqueTagsArr = checkUniqueTags(notesData);

    localStorage.setItem("tag", sortState.currentTag);
    localStorage.setItem("sortType", sortState.sortType);
    localStorage.setItem("sortDirection", sortState.sortDirection);

    setNotesData(filterNotesByTag(sortState.currentTag, sortState.sortDirection));

    return sortTags([DEFAULT_TAG, ...uniqueTagsArr]);
  });

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

    dispatchSort({ type: "currentTag", value: tagNum });
    localStorage.setItem("tag", tagNum);

    console.log("смена тега");

    if (sortState.searchText == "") {
      setNotesData(filterNotesByTag(tagNum, sortState.sortDirection));
    } else {
      getNotesBySearchText(sortState.searchText, tagNum);
    }
  };

  const changeSort = (e, direction = sortState.sortDirection) => {
    let sortNum;
    try {
      sortNum = e.target.value;
      if (sortNum) {
        localStorage.setItem("sortType", sortNum);
      } else {
        throw new Error("side generating");
      }
    } catch (error) {
      sortNum = sortState.sortType;
    }

    dispatchSort({ type: "sortType", value: sortNum });
    setNotesData((prev) => {
      return sortNotes([...prev], sortNum, direction);
    });
  };

  const changeSortDirection = (e) => {
    changeSort(e, sortState.sortDirection * -1);
    localStorage.setItem("sortDirection", sortState.sortDirection * -1);

    dispatchSort({ type: "sortDirection", value: sortState.sortDirection * -1 });
  };

  const addNewNote = (newNote) => {
    localStorage.setItem(newNote.noteId, JSON.stringify(newNote));

    const uniqueTagsArr = checkUniqueTags(getLocalNotes());

    const sortedTags = sortTags(uniqueTagsArr);

    const isTag = sortedTags.some((tagObj) => tagObj.id == sortState.currentTag);
    if (sortState.currentTag != "0" && !isTag) {
      changeTag();
    } else {
      setNotesData(filterNotesByTag(sortState.currentTag, sortState.sortDirection));
    }

    setTags([DEFAULT_TAG, ...sortedTags]);

    dispatchUiState({ type: "isNoteEdit", value: false });
  };

  const getNotesBySearchText = (searchData, tagNum = sortState.currentTag) => {
    dispatchSort({ type: "searchText", value: searchData });
    const allNotes = filterNotesByTag(tagNum, sortState.sortDirection);

    const searchedNotes = allNotes.filter((note) => {
      const noteText = `${note.name} ${note.text}`.toLowerCase();
      return noteText.includes(searchData.toLowerCase());
    });
    setNotesData(searchedNotes);
  };

  const switchSearchStatus = (isSearch) => {
    if (isSearch) {
      dispatchUiState({ type: "isSearch", value: true });
    } else {
      dispatchUiState({ type: "isSearch", value: false });
      getNotesBySearchText("");
      dispatchSort({ type: "searchText", value: "" });
    }
  };

  const editNote = (e) => {
    const noteToEdit = notesData.filter((note) => note.noteId == e.currentTarget.id);

    if (e.target.closest("button")) {
      localStorage.removeItem(noteToEdit[0].noteId);

      if (sortState.searchText == "") {
        setNotesData(filterNotesByTag(sortState.currentTag, sortState.sortDirection));
      } else {
        getNotesBySearchText(sortState.searchText);
      }

      const uniqueTagsArr = checkUniqueTags(getLocalNotes());

      const sortedTags = sortTags(uniqueTagsArr);

      const isTag = sortedTags.some((tagObj) => tagObj.id == sortState.currentTag);

      if (sortState.currentTag != "0" && !isTag) {
        changeTag();
        setTags([DEFAULT_TAG, ...sortedTags]);
      }
    } else if (!e.target.closest("label")) {
      setNoteToEdit(...noteToEdit);
      dispatchUiState({ type: "isNoteEdit", value: true });
    }
  };

  const userInfo = () => {
    dispatchUiState({ type: "isLogIn", value: true });
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-2xs sm:w-xl md:w-2xl">
        {(uiState.isNoteEdit || uiState.isSignUp || uiState.isLogIn) && <BlurMask />}
        <div className="w-full sm:relative flex flex-col justify-center items-center mt-0.5">
          <h1 className="font-bold text-3xl mx-auto">To DO LIST</h1>
          <Button
            onClick={userInfo}
            className={[
              "bg-primary-bg",
              "hover:bg-secondary",
              "border-2",
              "border-primary",
              "w-10",
              "h-8",
              "flex",
              "justify-center",
              "items-center",
              "sm:w-12",
              "sm:h-10",
              "absolute",
              "top-2",
              "sm:top-0",
              "sm:right-0",
              "right-2",
            ]}>
            <img className="w-full h-full" src={isLogined ? `images/loginTrue.png` : `images/login.png`} alt="login" />
          </Button>
          <UserName>{userData.user ? userData?.email : "пользователь: гость"}</UserName>
        </div>
        <div className="flex justify-between gap-8 sm:gap-4 items-end sm:grid sm:grid-cols-3">
          <div className="absolute top-2 left-2 sm:relative sm:top-0 sm:left-0 sm:justify-self-start">
            <Button
              onClick={() => switchSearchStatus(!uiState.isSearch)}
              className={["bg-primary-bg", "hover:bg-secondary", "border-2", "border-primary", "w-10", "h-8", "rounded-[50%]", "flex", "justify-center", "items-center", "sm:w-15", "sm:h-10"]}>
              <img className="h-full" src="images/search.png" alt="search" />
            </Button>
            {uiState.isSearch && <Search onClick={() => switchSearchStatus(false)} onChangeSearchInput={getNotesBySearchText} />}
          </div>
          <div className="justify-self-start sm:justify-self-center">
            <Button
              onClick={() => {
                setNoteToEdit("");
                dispatchUiState({ type: "isNoteEdit", value: true });
              }}
              className={["bg-primary", "text-zinc-700", "hover:bg-secondary", "text-xs", "w-20", "h-6", "sm:w-30", "sm:h-10", "sm:text-base"]}>
              Добавить
            </Button>
          </div>
          <div className="relative flex grow justify-between gap-2">
            <div className="flex-[0_0_49%] gap-1 text-xs sm:text-sm">
              <OptionList optionName="sortType" value={sortState.sortType} options={SORTING_KEYS} onChange={changeSort}>
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
              <OptionList optionName="tags" value={sortState.currentTag} options={tags} onChange={changeTag}>
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
                  sortNum={sortState.sortType}
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
            <div className="text-base sm:text-lg text-center">{uiState.isSearch ? "Измените фильтры" : "Добавьте первую заметку"}</div>
          )}
        </div>
      </div>
      {uiState.isNoteEdit && <EditNote noteToEdit={noteToEdit} onSave={addNewNote} onClose={() => dispatchUiState({ type: "isNoteEdit", value: false })} />}
      {uiState.isLogIn && <UserInfo />}
    </>
  );
}

export default App;
