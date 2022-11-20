import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getAllUsers,
  getMembers,
  setServerUsers,
  addServerMember,
  removeServerMember,
} from "../../store/users";
import { getServers } from "../../store/servers";
import { useSelectedServer } from "../../context/ServerContext";

const NewServerMember = ({ serverId, currMembers }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);
  const allUsers = useSelector((state) => state.users.allUsers);
  const serverUsers = useSelector((state) => state.users.serverUsers);
  const { selectedServer } = useSelectedServer();
  const serversArr = Object.values(servers);
  let membersArr = Object.values(serverUsers);
  const usersArr = Object.values(allUsers)[0];
  const currServer = servers[serverId];

  // let currMembers = [];
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState();
  const [memberId, setMemberId] = useState();
  const [userSelect, setUserSelect] = useState([]);
  const [memberSelect, setMemberSelect] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  if (currServer?.server_members) {
    currMembers = Object.values(currServer?.server_members);
  }

  useEffect(() => {
    dispatch(getServers());
    dispatch(getAllUsers());
    dispatch(setServerUsers(currMembers));
  }, [serverId]);

  useEffect(() => {
    let selected = usersArr?.find((user) => user.username === memberSelect);
    console.log("MEMBER ID SELECTED", memberId);
    setMemberId(selected?.id);
  }, [memberSelect]);

  useEffect(() => {
    let selected = usersArr?.find((user) => user.username === userSelect);
    console.log("USER ID SELECTED", userId);
    setUserId(selected?.id);
  }, [userSelect]);

  const revert = () => {
    setUserId();
    setUserSelect([]);
    setMemberId();
    setMemberSelect([]);
  };

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);
    // if (!name) errors.push("Server name is required.");
    setValidationErrors(errors);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    // a user needs to be the admin in order to allow editing
    // if (user.id === serversArr[serverId]?.admin_id) {
    await dispatch(addServerMember(serverId, userId));
    return history.push(`/servers/${serverId}`);
    // }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    // a user needs to be the admin in order to allow editing
    // if (user.id === serversArr[serverId]?.admin_id) {
    dispatch(removeServerMember(serverId, memberId));
    dispatch(getMembers());
    revert();
    return history.push(`/servers/${serverId}`);
    // }
  };

  let notJoined;
  let currMembersId = currMembers.map((member) => member.id);

  if (allUsers) {
    notJoined = Object.values(allUsers)[0]?.filter(
      (user) => !currMembersId.includes(user.id)
    );
  }

  console.log(usersArr, "USERS");
  console.log(membersArr, "MEMBERS");
  console.log(notJoined, "NOT MEMBERS");

  // set user albums for form select
  const updateMember = (e) => {
    setMemberSelect(e.target.value);
    console.log("member select ", memberSelect);
  };

  const updateUser = (e) => {
    setUserSelect(e.target.value);
    console.log("member select ", userSelect);
  };

  return (
    <>
      <form className="add-remove-form" onSubmit={handleAdd}>
        <div className="add-members">Add A User:</div>
        <select
          onChange={updateUser}
          value={userSelect}
          placeholder="Add a user:"
        >
          <option value="" disabled selected>
            Select an user to add...
          </option>
          {notJoined?.map((user) => {
            return <option key={user.username}>{user.username}</option>;
          })}
        </select>
        <ul className="errors">
          {validationErrors.length > 0 &&
            validationErrors.map((err) => (
              <li id="err" key={err}>
                {err}
              </li>
            ))}
        </ul>
        <button
          className="edit-server-submit"
          type="submit"
          disabled={!!validationErrors.length}
        >
          Add
        </button>
      </form>

      <form className="remove-form" onSubmit={handleRemove}>
        <div className="remove-members">Remove A Member:</div>
        <select
          onChange={updateMember}
          value={memberSelect}
          placeholder="Remove a member:"
        >
          <option value="" disabled selected>
            Select an member to remove...
          </option>
          {membersArr?.map((user) => {
            return <option key={user.username}>{user.username}</option>;
          })}
        </select>
        <ul className="errors">
          {validationErrors.length > 0 &&
            validationErrors.map((err) => (
              <li id="err" key={err}>
                {err}
              </li>
            ))}
        </ul>
        <button
          className="edit-server-submit"
          type="submit"
          disabled={!!validationErrors.length}
        >
          Remove
        </button>
      </form>
    </>
  );
};

export default NewServerMember;

/*
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/users";

const NewServerMember = ({ serverId, currMembers }) => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users.allUsers);

  const addMember = async (userId) => {
    console.log("user id", userId);
    console.log("server id", serverId);
    const response = await fetch(/api/servers/${serverId}/members, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        server_id: serverId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
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
  let notJoined
  if (allUsers) {
    notJoined = Object.values(allUsers)[0]?.filter(
      (user) => !currMembersId.includes(user.id)
    );
  }

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
*/
