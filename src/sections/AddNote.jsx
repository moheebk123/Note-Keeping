import { useRef, useState, useContext } from "react";
import propTypes from "prop-types";
import { NoteOperations } from "../context/NoteOperations";
import { Close, Done, PushPinOutlined, PushPin } from "@mui/icons-material";
import { Fab, Stack, Tooltip, TextField } from "@mui/material";

function AddNote({ addable, showAddable, hideAddable, showAlert }) {
  // For Pinned or Unpinned Note
  const [pin, setPin] = useState(false);

  // Reference for New Note Data - title, tagline, content
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const contentRef = useRef(null);

  // Context of Create Note Functions
  const { createNote } = useContext(NoteOperations);

  const handleCreate = () => {
    const title = titleRef.current.value;
    const tagline = taglineRef.current.value;
    const content = contentRef.current.value;
    if (title.length > 0 && tagline.length > 0 && content.length > 0) {
      const newNote = {
        title: title,
        tagline: tagline,
        content: content,
        pinned: pin,
      };
      createNote(newNote);
      titleRef.current.value = "";
      taglineRef.current.value = "";
      contentRef.current.value = "";
      hideAddable()
    } else {
      showAlert("warning", "Fill required fields to proceed.");
    }
  };

  return (
    <div className="rounded-md shadow-xl sticky z-20 top-4 p-2 my-4 bg-slate-50 w-full sm:w-96 mx-auto">
      {/* Take Note Title */}
      <div className="my-2">
        <TextField
          className="w-full bg-white"
          id="outlined-textarea"
          label="Title"
          placeholder="Enter Note Title.."
          multiline
          required
          inputRef={titleRef}
          onFocus={showAddable}
        />
      </div>

      {/* Take Note Tagline */}
      {addable && (
        <div className="my-2">
          <TextField
            className="w-full bg-white"
            id="outlined-textarea"
            label="Tagline"
            placeholder="Enter Note Tagline.."
            multiline
            required
            inputRef={taglineRef}
          />
        </div>
      )}

      {/* Take Note Content */}
      {addable && (
        <div className="my-2">
          <TextField
            className="w-full bg-white"
            id="outlined-textarea"
            label="Content"
            placeholder="Enter Note Content.."
            multiline
            required
            inputRef={contentRef}
          />
        </div>
      )}
      {addable && (
        <div className="flex justify-between p-2">
          {/* Create Pin or Unpin Note */}
          {pin ? (
            <Fab
              className="icon-container"
              color="warning"
              onClick={() => setPin(() => false)}
            >
              <Tooltip title="Create Unpin Note" placement="bottom">
                <PushPin />
              </Tooltip>
            </Fab>
          ) : (
            <Fab className="icon-container" onClick={() => setPin(() => true)}>
              <Tooltip title="Create Pinned Note" placement="bottom">
                <PushPinOutlined />
              </Tooltip>
            </Fab>
          )}

          <Stack direction="row" spacing={2}>
            {/* Create Note Icon */}
            <Fab
              className="icon-container"
              color="success"
              onClick={handleCreate}
            >
              <Tooltip title="Create Note" placement="bottom">
                <Done />
              </Tooltip>
            </Fab>
            {/* Close Addable Area */}
            <Fab color="error" className="icon-container" onClick={hideAddable}>
              <Tooltip title="Close Note" placement="bottom">
                <Close />
              </Tooltip>
            </Fab>
          </Stack>
        </div>
      )}
    </div>
  );
}

AddNote.propTypes = {
  addable: propTypes.bool.isRequired,
  showAddable: propTypes.func.isRequired,
  hideAddable: propTypes.func.isRequired,
  showAlert: propTypes.func.isRequired,
};

export default AddNote;
