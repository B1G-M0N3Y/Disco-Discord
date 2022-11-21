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
  const [userSelect, setUserSelect] = useState();
  const [memberSelect, setMemberSelect] = useState();
  const [addErrors, setAddErrors] = useState([]);
  const [removeErrors, setRemoveErrors] = useState([]);

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

    setMemberId(selected?.id);
  }, [memberSelect]);

  useEffect(() => {
    let selected = usersArr?.find((user) => user.username === userSelect);

    setUserId(selected?.id);
  }, [userSelect]);

  const revert = () => {
    setUserId();
    setUserSelect();
    setMemberId();
    setMemberSelect();
  };

  // remove validations
  useEffect(() => {
    const errors = [];
    setRemoveErrors(errors);
    if (!memberSelect) errors.push("Select a member.");
    // if (user.id !== serversArr[serverId]?.admin_id)
    //   errors.push("Only the admin can add or remove members.");
    setRemoveErrors(errors);
  }, [memberSelect]);

  // add validations
  useEffect(() => {
    const errors = [];
    setAddErrors(errors);
    if (!userSelect) errors.push("Select a user.");
    // if (user.id !== serversArr[serverId]?.admin_id)
    //   errors.push("Only the admin can add or remove members.");
    setAddErrors(errors);
  }, [userSelect]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddErrors([]);
    setUserSelect([]);
    // a user needs to be the admin in order to allow editing
    // if (user.id === serversArr[serverId]?.admin_id) {
    await dispatch(addServerMember(serverId, userId));
    await dispatch(getServers());
    revert();
    // }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setRemoveErrors([]);
    setUserSelect([]);
    // a user needs to be the admin in order to allow editing
    // if (user.id === serversArr[serverId]?.admin_id) {
    await dispatch(removeServerMember(serverId, memberId));
    await dispatch(getServers());
    revert();
    // }
  };

  let notJoined;
  let currMembersId = currMembers.map((member) => member.id);

  if (allUsers) {
    notJoined = Object.values(allUsers)[0]?.filter(
      (user) => !currMembersId.includes(user.id)
    );
  }
  // set user albums for form select
  const updateMember = (e) => {
    setMemberSelect(e.target.value);
  };

  const updateUser = (e) => {
    setUserSelect(e.target.value);
  };

  return (
    <>
      <form className="add-remove-form" onSubmit={handleAdd}>
        <div className="add-remove-members">Add A User:</div>
        <select
          className="select-member"
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
        {/* <ul className="errors">
          {addErrors.length > 0 &&
            addErrors.map((err) => (
              <li id="err" key={err}>
                {err}
              </li>
            ))}
        </ul> */}
        <button
          className={
            addErrors.length > 0 ? "member-edit-disabled" : "edit-user-submit"
          }
          type="submit"
          disabled={!!addErrors.length}
        >
          Add
        </button>
      </form>

      <form className="remove-form" onSubmit={handleRemove}>
        <div className="add-remove-members">Remove A Member:</div>
        <select
          className="select-member"
          onChange={updateMember}
          value={memberSelect}
          placeholder="Remove a member:"
        >
          <option value="" disabled selected>
            Select an member to remove...
          </option>
          {servers[serverId]?.server_members?.map((user) => {
            if (servers[serverId].admin_id !== user.id) {
              return <option key={user.username}>{user.username}</option>;
            }
          })}
        </select>
        {/* <ul className="errors">
          {removeErrors.length > 0 &&
            removeErrors.map((err) => (
              <li id="err" key={err}>
                {err}
              </li>
            ))}
        </ul> */}
        <button
          className={
            removeErrors.length > 0
              ? "member-edit-disabled"
              : "edit-member-submit"
          }
          type="submit"
          disabled={!!removeErrors.length}
        >
          Remove
        </button>
      </form>
    </>
  );
};

export default NewServerMember;
