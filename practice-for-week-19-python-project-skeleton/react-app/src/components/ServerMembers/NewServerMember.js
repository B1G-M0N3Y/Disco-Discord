import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/users";

const NewServerMember = ({ serverId, currMembers }) => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);

  const addMember = async (userId) => {
    console.log("user id",userId)
    console.log("server id",serverId)
    const response = await fetch(`/api/servers/${serverId}/members`,{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          user_id: userId,
          server_id: serverId
        })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data)
    }
  };

  console.log(allUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Get all member id from current list of members so...
  const currMembersId = currMembers.map((member) => member.id);
  // ... we can filter users by id to get an array of only
  // users who are not members of our current server.
  console.log(Object.values(allUsers));
  const notJoined = Object.values(allUsers)[0]?.filter(
    (user) => !currMembersId.includes(user.id)
  );

  console.log("not joined", notJoined);

  return (
    <div>
      <p>Add a friend: </p>
      {notJoined?.map((user) => (
        <div>
          <p>{user.username}</p>
          <i onClick={() => addMember(user.id)} class="fa-solid fa-plus"></i>
        </div>
      ))}
    </div>
  );
};

export default NewServerMember;
