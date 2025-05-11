const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-[#242424] p-4 rounded shadow-lg max-w-xs w-full">
      <p className="text-white mb-4">{message}</p>
      <button
        onClick={onClose}
        className="mt-2 px-4 py-2 bg-[rgb(18,18,18)] text-white rounded hover:opacity-80"
      >
        OK
      </button>
    </div>
  </div>
);

export default Modal;