import SliderSection from "./SliderSection";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

// Đặt props vào object { title, items, ... }
const RenderSlider = ({
  title,
  items,
  currentPage,
  setPage,
  allItems,
  type = "song",
  fetchSongs,
  itemsPerPage = 6,
}) => {
  const { playWithId } = useContext(PlayerContext);
  

  if (!items || items.length === 0) return null;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginate = (arr, page) =>
    arr.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <SliderSection
      title={title}
      items={paginate(items, currentPage)}
      type={type}
      onPlay={(item) => playWithId(item, allItems)}
      onPrevPage={() => setPage(Math.max(0, currentPage - 1))}
      onNextPage={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
      fetchSongs={() => fetchSongs()}
    />
  );
};

export default RenderSlider;
