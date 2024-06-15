import propTypes from "prop-types";
import Note from "../components/Note";
import Message from "../components/Message";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";

function Notes({ heading, notes }) {
  // To Show Notes Between Them
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(6);

  // Update Indexes to Show Current Page Notes
  const getCurPage = (event, page) => {
    setStartIndex(() => page * 6 - 6);
    setEndIndex(() => page * 6);
  };

  return (
    <div className="h-max block">
      {/* Note Type Heading - Other notes, Pinned Notes */}
      <div className="font-bold text-xl text-slate-800 my-2">{heading}</div>

      {/* List of Notes */}
      <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 ? (
          <Message
            message={
              heading === "Other Notes"
                ? "No note created yet."
                : "No note pinned yet."
            }
          />
        ) : (
          notes.map((note, index) => {
            if (startIndex <= index && endIndex > index) {
              return <Note key={index} note={note} />;
            }
          })
        )}
      </div>

      {/* Pagination Section */}
      {notes.length !== 0 && (
        <Pagination
          className="my-5 mx-auto w-fit"
          count={Math.ceil(notes.length / 6)}
          color="primary"
          onChange={getCurPage}
        />
      )}
    </div>
  );
}

// Defined for Props Validation
Notes.propTypes = {
  heading: propTypes.string.isRequired,
  notes: propTypes.array.isRequired,
};

export default Notes;
