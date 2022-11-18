import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/users";

const NewServerMember = ({currMembers}) => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);


  console.log(allUsers)

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Get all member id from current list of members so...
  const currMembersId = currMembers.map(member => member.id)
  // ... we can filter users by id to get an array of only
  // users who are not members of our current server.
  const notJoined = Object.values(allUsers).filter(user => !currMembersId.includes(user.id))


  return (
  <div>
    <p>Add a friend: </p>
    {notJoined[0].map(user => (
        <p>{user.username}</p>
    ))}
  </div>
  );
};

export default NewServerMember;
