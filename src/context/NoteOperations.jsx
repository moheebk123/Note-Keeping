import { createContext } from "react";

export const NoteOperations = createContext({
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  changeNoteData: () => {},
});
