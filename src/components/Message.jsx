import propTypes from "prop-types";

// Used to Handle Loading, Error, Empty Note State
function Message({ message }) {
  return (
    <div className="message text-lg w-screen font-medium h-24 grid place-content-center text-center">
      {message}
    </div>
  );
}

// Defined for Props Validation
Message.propTypes = {
  message: propTypes.string.isRequired,
};

export default Message;
