import databaseService from "./appwrite/database";
import { useEffect, useState } from "react";
import { NoteOperations } from "./context/NoteOperations";
import Notes from "./sections/Notes";
import Message from "./components/Message";
import EditableNote from "./sections/EditableNote";
import { Snackbar, Alert } from "@mui/material";
import "./App.css";
import AddNote from "./sections/AddNote";
import Heading from "./sections/Heading";

function App() {
  // For List of Pinned and Unpinned Notes
  const [notes, setNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);

  // To Get Note Data
  const [addable, setAddable] = useState(false);

  // Popup Tab (curNote - Note Data, editableNote - Show or Hide)
  const [curNote, setCurNote] = useState({});
  const [editableNote, setEditableNote] = useState(false);

  // For Handling Loading and Error State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // For Operation Message
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState("");
  const [message, setMessage] = useState("");

  // Get Initial Notes to show on Load
  useEffect(() => {
    getNotes();
  }, []);

  // Create New Note
  async function createNote(newNote) {
    try {
      const status = await databaseService.createNote(newNote)
      if (status === true) {
        setError(null)
        getNotes();
      showAlert("success", "Note Created Successfully.");
      } else if (status.includes('Fill')) {
        showAlert("warning", "Fill required fields to proceed.")
      } else if (status.includes('Error')) {
        setError(status)
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching notes.");
    }
  }

  // Get Pinned and Unpinned Notes
  async function getNotes() {
    setIsLoading(true);
    try {
      const fetchedNotes = await databaseService.getNotes();
      const fetchedPinnedNotes = await databaseService.getPinnedNotes();
      if (
        typeof fetchedPinnedNotes === "string" ||
        typeof fetchedNotes === "string"
      ) {
        setError(fetchedNotes);
      } else if (fetchedPinnedNotes.length >= 0 && fetchedNotes.length >= 0) {
        setPinnedNotes(() => fetchedPinnedNotes);
        setNotes(() => fetchedNotes);
        setError(null);
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching notes.");
    } finally {
      setIsLoading(false);
    }
  }

  // Update Note
  async function updateNote(id, updatedNote) {
    try {
      const status = await databaseService.updateNote(id, updatedNote);
      setEditableNote(() => false);
      if (typeof status === "string") {
        if (status.includes("Error")) {
          setError(status);
        } else if (status.includes("Nothing")) {
        showAlert("info", status);
        }
      } else {
        setError(null);
        getNotes();
        showAlert("success", "Note Updated Successfully.");
      }
    } catch (error) {
      console.log("Error : " + error);
      setError(error.message || "An error occurred while fetching notes.");
    }
  }

  // Delete Note
  async function deleteNote(id) {
    try {
      const status = await databaseService.deleteNote(id);
      getNotes();
      setEditableNote(() => false);
      if (typeof status === "string") {
        setError(status);
      } else {
        setError(null);
        showAlert("error", "Note Deleted Successfully.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching notes.");
    }
  }

  // Show Note Input Area
  const showAddable = () => setAddable(() => true);

  // Hide Note Input Area
  const hideAddable = () => setAddable(() => false);

  const showAlert = (color, msg) => {
    setMessage(msg);
    setVariant(color);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
  };

  // Show Popup Tab
  const showEditableNote = () => setEditableNote(() => true);

  // Hide Popup Tab
  const hideEditableNote = () => setEditableNote(() => false);

  // Changes Popup Tab Note Data
  const changeNoteData = (note) => {
    setCurNote(() => {
      return {
        id: note.id,
        title: note.title,
        tagline: note.tagline,
        content: note.content,
        pinned: note.pinned,
        lastedit: note.lastedit,
      };
    });
    showEditableNote();
  };

  return (
    <>
      {error ? (
        <Message message={error} /> // Error State
      ) : isLoading ? (
        <Message message="Loading..." /> // Loading State
      ) : (
        <NoteOperations.Provider
          value={{
            createNote,
            updateNote,
            deleteNote,
            changeNoteData,
          }}
            >
              {/* Heading */}
              <Heading />

          {/* Add Note Section */}
          <AddNote
            addable={addable}
            showAddable={showAddable}
            hideAddable={hideAddable}
            showAlert={showAlert}
          />

          {/* Pinned Notes Section */}
          <Notes heading="Pinned Notes" notes={pinnedNotes} />

          {/* Other Notes Section */}
          <Notes heading="Other Notes" notes={notes} />

          {/* Popup tab for each note */}
          {editableNote && (
            <EditableNote note={curNote} hideEditableNote={hideEditableNote} showAlert={showAlert} />
          )}

          {/* Shows Message after operation */}
          <Snackbar open={open}>
            <Alert severity={variant} variant="filled" sx={{ width: "100%" }}>
              {message}
            </Alert>
          </Snackbar>
        </NoteOperations.Provider>
      )}
    </>
  );
}

export default App;
