const SongListPopup = ({ songs, onAddSong, onClose, onDeleteSong }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[600px] max-w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Danh sách bài hát</h2>

        <div className="space-y-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center border p-3 rounded shadow"
            >
              <img
                src={song.cover_image}
                alt={song.title}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{song.title}</h3>
                <a
                  href={song.audio_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongListPopup;
