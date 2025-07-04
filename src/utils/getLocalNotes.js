import { sortNotes } from "./sortNotes";

export const getLocalNotes = (sortNum) => {
  const allKeys = Object.keys(localStorage);
  const noteKeys = allKeys.filter((key) => key.startsWith("note_"));
  const sortedKeys = noteKeys.sort((a, b) => {
    const numA = parseInt(a.replace("note_", ""));
    const numB = parseInt(b.replace("note_", ""));
    return numA - numB;
  });
  const notesArray = sortedKeys.map((key) => JSON.parse(localStorage.getItem(key)));
  return sortNotes(notesArray, sortNum);
};
