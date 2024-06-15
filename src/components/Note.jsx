import propTypes from "prop-types";
import { PushPinOutlined, PushPin } from "@mui/icons-material";
import { CardActionArea, Fab, Tooltip } from "@mui/material";
import { NoteOperations } from "../context/NoteOperations";
import { useContext } from "react";

function Note({ note }) {
  // Context Functions for updateNote - Update Note, changeNoteData - Change Popup Note Tab Data
  const { updateNote, changeNoteData } = useContext(NoteOperations);

  // Update Note Data
  const handleUpdate = () => {
    const updatedNote = {
      title: note.title,
      tagline: note.tagline,
      content: note.content,
      pinned: !note.pinned,
    };
    updateNote(note.id, updatedNote);
  };

  return (
    <div className="rounded-md shadow-lg border-slate-300 border cursor-pointer relative">
          {/* Pin or Unpin Icon */}
          <Fab
            color={note.pinned ? "warning" : ""}
            className="icon-container pin-container"
            onClick={() => handleUpdate()}
          >
            {note.pinned ? (
              <Tooltip title="Remove from Pin" placement="top">
                <PushPin />
              </Tooltip>
            ) : (
              <Tooltip title="Add to Pin" placement="top">
                <PushPinOutlined />
              </Tooltip>
            )}
          </Fab>

      <CardActionArea
        className="w-full h-full"
        sx={{ padding: "15px" }}
        onClick={() => changeNoteData(note)}
      >
          {/* Note Title */}
        <h2 className="text-xl font-bold capitalize mr-4">
          {note.title}
        </h2>

        {/* Note Tagline */}
        <h4 className="text-lg font-bold text-slate-600">{note.tagline}</h4>
      </CardActionArea>
    </div>
  );
}

// Defined for Props Validation
Note.propTypes = {
  note: propTypes.shape().isRequired,
};

export default Note;
