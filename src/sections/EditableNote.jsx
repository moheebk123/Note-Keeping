import { useState, useRef, useContext } from "react";
import propTypes from "prop-types";
import {
  Close,
  Edit,
  Done,
  Delete,
  PushPinOutlined,
  PushPin,
} from "@mui/icons-material";
import { Fab, Stack, Tooltip } from "@mui/material";
import { NoteOperations } from "../context/NoteOperations";

function EditableNote({ note, hideEditableNote, showAlert }) {
  // Is Note Editable or Note
  const [editable, setEditable] = useState(false);

  // Context of Update and Delete Note Functions
  const { updateNote, deleteNote } = useContext(NoteOperations);

  // Reference for Note Data - title, tagline, content
  const titleRef = useRef(note.title);
  const taglineRef = useRef(note.tagline);
  const contentRef = useRef(note.content);

  const date = new Date(note.lastedit);

  // Update Note Data
  const handleUpdate = () => {
    if (
      note.title === titleRef.current.innerText &&
      note.tagline === taglineRef.current.innerText &&
      note.content === contentRef.current.innerText
    ) {
      setEditable(() => false);
      showAlert("info", "Nothing to Change.");
      } else {
      const updatedNote = {
        title: titleRef.current.innerText,
        tagline: taglineRef.current.innerText,
        content: contentRef.current.innerText,
        pinned: note.pinned,
      };
      setEditable(() => false);
      updateNote(note.id, updatedNote);
    }
  };

  // Update Pin or Unpin Note in Popup Note Tab
  const handlePinUpdate = () => {
    const updatedNote = {
      title: note.title,
      tagline: note.tagline,
      content: note.content,
      pinned: !note.pinned,
    };
    updateNote(note.id, updatedNote);
  };

  return (
    <div className="editable-tab bg-white fixed p-4 rounded-md">
      {/* Close Icon - Close Popup Note Tab */}
      <Fab
        color="error"
        className="icon-container close-container"
        onClick={() => hideEditableNote()}
      >
        <Tooltip title="Close Note" placement="left">
          <Close />
        </Tooltip>
      </Fab>

      {/* Note Title */}
      <h2
        ref={titleRef}
        className="text-xl font-bold capitalize mb-4 p-2 outline-slate-400"
        contentEditable={editable}
      >
        {note.title}
      </h2>

      {/* Note Tagline */}
      <h4
        ref={taglineRef}
        className="text-lg font-bold text-slate-600 my-2 p-2 border-y border-slate-400 outline-slate-400"
        contentEditable={editable}
      >
        {note.tagline}
      </h4>

      {/* Note Content */}
      <p
        ref={contentRef}
        className="mt-4 mb-7 p-2 outline-slate-400"
        contentEditable={editable}
      >
        {note.content}
      </p>

      {/* Last Edit Time */}
      <Stack className="bg-white font-bold text-slate-600 absolute bottom-1 left-4">
        {date.toLocaleString()}
      </Stack>

      {/* Icons Box */}
      <Stack
        className="bg-white absolute bottom-1 right-1 px-4"
        direction="row"
        spacing={1}
      >
        {/* Edit or Confirm Edit Icon */}
        {editable ? (
          <Fab
            className="icon-container"
            color="success"
            onClick={() => handleUpdate()}
          >
            <Tooltip title="Confirm Edit" placement="top">
              <Done />
            </Tooltip>
          </Fab>
        ) : (
          <Fab
            className="icon-container"
            color="primary"
            onClick={() => setEditable(() => true)}
          >
            <Tooltip title="Edit Note" placement="top">
              <Edit />
            </Tooltip>
          </Fab>
        )}

        {/* Pinned or Unpinned Icon */}
        {note.pinned ? (
          <Fab
            className="icon-container"
            color="warning"
            onClick={() => handlePinUpdate()}
          >
            <Tooltip title="Remove from Pin" placement="top">
              <PushPin />
            </Tooltip>
          </Fab>
        ) : (
          <Fab className="icon-container" onClick={() => handlePinUpdate()}>
            <Tooltip title="Add to Pin" placement="top">
              <PushPinOutlined />
            </Tooltip>
          </Fab>
        )}

        {/* Delete Icon */}
        <Fab
          className="icon-container"
          color="error"
          onClick={() => deleteNote(note.id)}
        >
          <Tooltip title="Delete Note" placement="top">
            <Delete />
          </Tooltip>
        </Fab>
      </Stack>
    </div>
  );
}

// Define for Props Validation
EditableNote.propTypes = {
  note: propTypes.shape().isRequired,
  hideEditableNote: propTypes.func.isRequired,
  showAlert: propTypes.func.isRequired,
};

export default EditableNote;
