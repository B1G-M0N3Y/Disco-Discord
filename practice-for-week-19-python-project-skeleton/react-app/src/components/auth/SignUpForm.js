import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import "./SignUpForm.css";

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };
    if (password === repeatPassword) {
      const data = await dispatch(signUp(userData));
      if (data) {
        setErrors(data);
      }
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };
  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const updateLastName = (e) => {
    setLastName(e.target.value);
  };
  const updateEmail = (e) => {
    setEmail(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };
  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <form class="sign-up-form-container" onSubmit={onSignUp}>
      <div class="errors">
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>

      <div class="sign-up-form">
        <div>
          <label>User Name</label>
          <input
            id="inputs"
            type="text"
            name="username"
            onChange={updateUsername}
            value={username}
          ></input>
        </div>

        <div>
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            onChange={updateFirstName}
            value={firstName}
          ></input>
        </div>
        <div>
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            onChange={updateLastName}
            value={lastName}
          ></input>
        </div>
        <div>
          <label>Email</label>
          <input
            id="inputs"
            type="text"
            name="email"
            onChange={updateEmail}
            value={email}
          ></input>
        </div>

        <div>
          <label>Password</label>
          <input
            id="inputs"
            type="password"
            name="password"
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <label>Repeat Password</label>
          <input
            id="inputs"
            type="password"
            name="repeat_password"
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <button id="sign-up-button" type="submit">
          SIGN UP
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
