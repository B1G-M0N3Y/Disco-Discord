import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteChannel } from "../../store/channels";

const DeleteChannel = ({ channelId }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  // onClick, delete the song from the url
  const handleClick = async (e) => {
    e.preventDefault();
    await dispatch(deleteChannel(channelId));
    return history.push(`/`);
  };

  return (
    <>
      <i class="fa-regular fa-trash-can" onClick={handleClick}></i>
    </>
  );
};

export default DeleteChannel;
