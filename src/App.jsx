import { useEffect, useReducer, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
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
import SingUp from "./components/SingUp";
import UserInfo from "./components/UserInfo";

function uiStateReducer(state, action) {
  switch (action.type) {
    case "isNoteEdit":
      return { ...state, isNoteEdit: action.value };
    case "isSearch":
      return { ...state, isSearch: action.value };
    case "isUser":
      return { ...state, isUser: action.value };
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
  isUser: false,
  isNoteEdit: false,
  isSearch: false,
  isSignUp: false,
  isLogIn: true,
};

const initialSortState = {
  sortType: localStorage.getItem("sortType") || "4",
  currentTag: localStorage.getItem("tag") || 0,
  sortDirection: localStorage.getItem("sortDirection") || 1,
  searchText: "",
};

const initialNotes = {
  visibleNotes: getLocalNotes(initialSortState.sortType, initialSortState.sortDirection),
  allNotes: getLocalNotes(initialSortState.sortType, initialSortState.sortDirection),
  deletingNoteIds: [],
  newNoteIdes: [],
};

function notesReducer(state, action) {
  switch (action.type) {
    case "allNotes":
      return { ...state, allNotes: action.value };
    case "visibleNotes":
      return { ...state, visibleNotes: action.value };
    case "deletingNoteIds":
      return { ...state, deletingNoteIds: action.value };
  }
}

function App() {
  const [isLogined, setIsLogined] = useState(false);

  const [sortState, dispatchSort] = useReducer(sortReducer, initialSortState);

  const [uiState, dispatchUiState] = useReducer(uiStateReducer, initialUiState);

  const [userData, setUserData] = useState({});

  //   const [notesData, setNotesData] = useState(getLocalNotes(sortState.sortType));
  const [notesData, dispatchNotes] = useReducer(notesReducer, initialNotes);

  const [noteToEdit, setNoteToEdit] = useState("");

  const filterNotes = () => {
    const sortedAllNotes = sortNotes(notesData.allNotes, sortState.sortType, sortState.sortDirection);

    const tagFilteredNotes = sortState.currentTag == "0" || !sortState.currentTag ? sortedAllNotes : sortedAllNotes.filter((note) => note.tag === sortState.currentTag);

    const searchFiltered = uiState.isSearch
      ? tagFilteredNotes.filter((note) => {
          const noteText = `${note.name} ${note.text}`.toLowerCase();
          return noteText.includes(sortState.searchText.toLowerCase());
        })
      : tagFilteredNotes;

    const deleteFiltered = notesData.deletingNoteIds.length ? searchFiltered.filter((note) => !notesData.deletingNoteIds.includes(note.noteId)) : searchFiltered;

    return deleteFiltered;
  };

  const [tags, setTags] = useState(() => {
    const uniqueTagsArr = checkUniqueTags(notesData.allNotes);
    return sortTags([DEFAULT_TAG, ...uniqueTagsArr]);
  });

  const switchTag = (e) => {
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

    if (sortState.searchText == "") {
      // const sortedNotes = sortNotes(filterNotesByTag(tagNum), sortState.sortNum, sortState.sortDirection);
      // dispatchNotes({ type: "visibleNotes", value: sortedNotes });
      // setNotesData(filterNotesByTag(tagNum, sortState.sortDirection));
    } else {
      // getNotesBySearchText(sortState.searchText, tagNum);
    }
  };

  const switchSort = (e) => {
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

    //  dispatchNotes({ type: "visibleNotes", value: sortNotes([...notesData.visibleNotes], sortNum, direction) });

    //  setNotesData((prev) => {
    //    return sortNotes([...prev], sortNum, direction);
    //  });
  };

  const switchSortDirection = () => {
    //  switchSort(e, sortState.sortDirection * -1);
    localStorage.setItem("sortDirection", sortState.sortDirection * -1);

    dispatchSort({ type: "sortDirection", value: sortState.sortDirection * -1 });
  };

  const saveNote = (noteData) => {
    console.log("notesData.allNotesnotesData.allNotes", notesData.allNotes);

    const allNotesId = notesData.allNotes.map((note) => note.noteId);
    console.log("allNotesId", allNotesId);
    console.log("allNotesId.includes(noteData.noteId)", allNotesId.includes(noteData.noteId));

    if (!allNotesId.includes(noteData.noteId)) {
      dispatchNotes({ type: "allNotes", value: [...notesData.allNotes, noteData] });
      localStorage.setItem(noteData.noteId, JSON.stringify(noteData));
    } else {
      const currentNote = notesData.allNotes.find((note) => note.noteId == noteData.noteId);
      const allNotesWithoutCurrent = notesData.allNotes.filter((note) => note.noteId != noteData.noteId);
      dispatchNotes({ type: "allNotes", value: [...allNotesWithoutCurrent, currentNote] });
      localStorage.setItem(noteData.noteId, JSON.stringify(noteData));
    }
    //  const uniqueTagsArr = checkUniqueTags(notesData.allNotes);

    //  const sortedTags = sortTags(uniqueTagsArr);

    //  const isCurrentTagDelete = !sortedTags.some((tagObj) => tagObj.id == sortState.currentTag);
    //  if (sortState.currentTag != "0" && isCurrentTagDelete) {
    //    switchTag();
    //  }
    //  setTags([DEFAULT_TAG, ...sortedTags]);

    checkTags();
    setTimeout(() => {
		console.log('timerrrr');
		
      dispatchNotes({ type: "visibleNotes", value: filterNotes() });
    }, 2000);

    dispatchUiState({ type: "isNoteEdit", value: false });
  };

  const switchSearchStatus = (isSearch) => {
    if (isSearch) {
      dispatchUiState({ type: "isSearch", value: true });
    } else {
      dispatchUiState({ type: "isSearch", value: false });
      // dispatchSort({ type: "searchText", value: "" });
    }
  };

  const editNote = (e) => {
    if (!e.target.closest("button") && !e.target.closest("label")) {
      const noteToEdit = notesData.visibleNotes.find((note) => note.noteId == e.currentTarget.id);

      setNoteToEdit(noteToEdit);
      dispatchUiState({ type: "isNoteEdit", value: true });
    }
  };

  const checkTags = (isDeletePending = false) => {
    const allNotes = !isDeletePending ? notesData.allNotes : notesData.allNotes.filter((note) => !notesData.deletingNoteIds.includes(note.noteId));
    const uniqueTagsArr = checkUniqueTags(allNotes);
    const sortedTags = sortTags(uniqueTagsArr);
    setTags([DEFAULT_TAG, ...sortedTags]);
    console.log("sortedTags", sortedTags);
    console.log("sortState.currentTag", sortState.currentTag);

    const isCurrentTagDelete = !sortedTags.some((tagObj) => sortState.currentTag == "0" || tagObj.id == sortState.currentTag);

    console.log("isCurrentTagDelete?", isCurrentTagDelete);

    if (sortState.currentTag != "0" && isCurrentTagDelete) {
      switchTag();
    } else {
      dispatchNotes({ type: "visibleNotes", value: filterNotes() });
    }
  };

  const pendingToDeleteNote = () => {
    //  localStorage.removeItem(id);

    //   dispatchNotes({ type: "current", value: id });
    if (notesData.deletingNoteIds.length) {
      console.log("PENDING DELETE");

      if (sortState.searchText == "") {
        //   const visibleNotes = filterNotes().filter((note) => !notesData.deletingNoteIds.includes(note.noteId));
        //   dispatchNotes({ type: "visibleNotes", value: visibleNotes });
        // setNotesData(filterNotesByTag(sortState.currentTag, sortState.sortDirection));
      } else {
        //   const visibleNotes = getNotesBySearchText(sortState.searchText).filter((note) => !notesData.deletingNoteIds.includes(note.noteId));
        //   dispatchNotes({ type: "visibleNotes", value: visibleNotes });
      }

      // const allNotes = notesData.allNotes.filter((note) => !notesData.deletingNoteIds.includes(note.noteId));

      checkTags(true);

      // const visibleNotes = filterNotes();
      // dispatchNotes({ type: "visibleNotes", value: visibleNotes });

      //  const uniqueTagsArr = checkUniqueTags(allNotes);
      //  const sortedTags = sortTags(uniqueTagsArr);
      //  setTags([DEFAULT_TAG, ...sortedTags]);

      //  const isCurrentTagDelete = !sortedTags.some((tagObj) => tagObj.id == sortState.currentTag);
      //  if (sortState.currentTag != "0" && isCurrentTagDelete) {
      //    switchTag();
      //  }
    }
  };

  useEffect(() => {
    pendingToDeleteNote();
  }, [notesData.deletingNoteIds]);

  const userInfo = () => {
    dispatchUiState({ type: "isUser", value: true });
  };

  useEffect(() => {
    localStorage.setItem("tag", sortState.currentTag);
    localStorage.setItem("sortType", sortState.sortType);
    localStorage.setItem("sortDirection", sortState.sortDirection);

    //  setNotesData(filterNotesByTag(sortState.currentTag, sortState.sortDirection))
    dispatchNotes({ type: "visibleNotes", value: filterNotes() });
  }, []);

  useEffect(() => {
    if (isLogined) {
      dispatchUiState({ type: "isLogIn", value: false });
    }
  }, [isLogined]);

  useEffect(() => {
    console.log("FILTER");

    const visibleNotes = filterNotes();
    dispatchNotes({ type: "visibleNotes", value: visibleNotes });
  }, [sortState, uiState.isSearch]);

  const getLogIn = (email, password) => {
    console.log("email APP", email);
    console.log("password APP", password);
  };

  const registration = (email, password, repeatPassword) => {
    console.log("email APP", email);
    console.log("password APP", password);
    console.log("repeatPassword APP", repeatPassword);
  };

  const closeModal = () => {
    dispatchUiState({ type: "isUser", value: false });
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-2xs sm:w-xl md:w-2xl">
        <AnimatePresence>{(uiState.isNoteEdit || uiState.isUser) && <BlurMask />}</AnimatePresence>
        <div className="w-full sm:relative flex flex-col justify-center items-center mt-0.5">
          <h1 className="font-bold text-3xl mx-auto">To DO LIST</h1>
          <Button
            onClick={userInfo}
            className={`bg-primary-bg hover-button border-2 border-primary w-10 h-8 flex justify-center items-center sm:w-12 sm:h-10 absolute top-2 sm:top-0 sm:right-0 right-2`}>
            <img className="w-full h-full" src={isLogined ? `images/loginTrue.png` : `images/login.png`} alt="login" />
          </Button>
          <UserName>{userData.user ? userData?.email : "пользователь: гость"}</UserName>
        </div>
        <div className="flex justify-between gap-8 sm:gap-4 items-end sm:grid sm:grid-cols-3">
          <div className="absolute top-2 left-2 sm:relative sm:top-0 sm:left-0 sm:justify-self-start">
            <Button
              onClick={() => switchSearchStatus(!uiState.isSearch)}
              className={`bg-primary-bg hover-button border-2 border-primary w-10 h-8 rounded-[50%] flex justify-center items-center sm:w-15 sm:h-10`}>
              <img className="h-full" src="images/search.png" alt="search" />
            </Button>
            <AnimatePresence>
              {uiState.isSearch && (
                <Search searchText={sortState.searchText} key="search" onClick={() => switchSearchStatus(false)} onChangeSearchInput={(e) => dispatchSort({ type: "searchText", value: e })} />
              )}
            </AnimatePresence>
          </div>
          <div className="justify-self-start sm:justify-self-center">
            <Button
              onClick={() => {
                setNoteToEdit("");
                dispatchUiState({ type: "isNoteEdit", value: true });
              }}
              className={`bg-primary text-zinc-700 hover-button text-xs w-20 h-6 sm:w-30 sm:h-10 sm:text-base`}>
              Добавить
            </Button>
          </div>
          <div className="relative flex grow justify-between gap-2">
            <div className="flex-[0_0_49%] gap-1 text-xs sm:text-sm">
              <OptionList optionName="sortType" value={sortState.sortType} options={SORTING_KEYS} onChange={switchSort}>
                Сортировать
              </OptionList>
              <Button
                onClick={switchSortDirection}
                className={`flex justify-center bottom-0 left-0 absolute bg-primary-bg sm:h-5 hover-button border border-primary w-5 h-4.5 text-xs -translate-x-[calc(100%+4px)]`}>
                <img className="h-full" src="images/sorting.png" alt="sorting" />
              </Button>
            </div>
            <div className="flex-[0_0_49%] text-xs sm:text-sm">
              <OptionList optionName="tags" value={sortState.currentTag} options={tags} onChange={switchTag}>
                Тег
              </OptionList>
            </div>
          </div>
        </div>
        <LayoutGroup>
          <motion.div layout className="rounded-2xl py-2 px-2 sm:py-5 sm:px-5 bg-secondary-bg flex flex-col gap-2 min-h-16">
            <AnimatePresence>
              {notesData.visibleNotes.length > 0 ? (
                notesData.visibleNotes.map((note) => {
                  const isDeleting = notesData.deletingNoteIds.includes(note.noteId);
                  return (
                    <motion.div
                      layout
                      key={`container_${note.noteId}`}
                      initial={{ x: 100, opacity: 0, border: "1px solid var(--color-primary)" }}
                      animate={{ x: 0, opacity: 1, border: "1px solid transparent" }}
                      exit={{ x: isDeleting ? -100 : 0, opacity: 0, border: "1px solid var(--color-primary)" }}>
                      <Note
                        onDelete={(e) => dispatchNotes({ type: "deletingNoteIds", value: [...notesData.deletingNoteIds, e] })}
                        sortNum={sortState.sortType}
                        onClick={editNote}
                        bgColor={`bg-note-${note.priority}`}
                        checked={note.checked}
                        dateChange={note.dateChange}
                        dateCreate={note.dateCreate}
                        key={note.noteId}
                        id={note.noteId}
                        isDeleting={notesData.deletingNoteIds.includes(note.noteId)}>
                        {note.name}
                      </Note>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div key="no-notes-div" className="text-base sm:text-lg text-center absolute">
                  {uiState.isSearch ? "Измените фильтры" : "Добавьте первую заметку"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
      <AnimatePresence>
        {uiState.isNoteEdit && <EditNote noteToEdit={noteToEdit} onSave={saveNote} onClose={() => dispatchUiState({ type: "isNoteEdit", value: false })} />}
        {uiState.isUser && (
          <motion.div
            initial={{ opacity: 1, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", damping: 10 } }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="modal flex flex-col will-change-transform">
            {uiState.isLogIn ? <LogIn getLogIn={getLogIn} onClose={closeModal} /> : uiState.isSignUp ? <SingUp registration={registration} onClose={closeModal} /> : <UserInfo />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* <div className="flex justify-end border-2 gap-20 border-amber-600 px-2">
        <AnimatePresence>
          <motion.button key="button-1" layout transition={{ duration: 0.3 }} className={`border-2 border-blue-900 w-auto h-8 cursor-pointer p-2 ${isSecond ? "" : ""}`}>
            {isSecond ? "КНОПКА 1КНОПКА 1" : "КНОПКА 1"}
          </motion.button>
          {isSecond && (
            <motion.button
              layout
              key="button-2"
              //   initial={'initial'}
              exit={{ width: 0, padding: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 0.3 }}
              className="border-2 border-blue-900 w-auto h-8 cursor-pointer px-2 overflow-hidden">
              КНОПКА 2
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <motion.button onClick={() => setIsSecond((prev) => !prev)} className="border-2 border-blue-900 w-auto h-8 cursor-pointer p-2">
        ТОГЛ
      </motion.button> */}
    </>
  );
}

export default App;
