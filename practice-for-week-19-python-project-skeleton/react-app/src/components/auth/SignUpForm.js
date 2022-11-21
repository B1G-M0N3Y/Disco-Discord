import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { getAllUsers } from "../../store/users";
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
  const users = useSelector((state) => state.users.allUsers);

  const usernames = [];

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onSignUp = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

    let errors = [];

    if (username.length <= 4 || username.length >= 50) {
      errors.push(
        "Username must be more than 4 characters and less than 50 characters "
      );
    }

    if (password.length <= 6 || password.length >= 50) {
      errors.push(
        "Password must be more than 6 characters and less than 50 characters "
      );
    }

    if (!validateEmail(email)) {
      errors.push("Email must be a valid email");
    }

    if (password !== repeatPassword) {
      errors.push("Passwords must match");
    }

    if (errors.length === 0) {
      const data = await dispatch(signUp(userData));
      if (data) {
        setErrors(data);
      }
    } else {
      setErrors(errors);
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
    console.log(username, "username");
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
      <p id="sign-up-title">SIGN UP</p>
      <div class="sign-up-errors">
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>

      <div class="sign-up-form">
        <div>
          <label>User Name</label>
          <input
            id="sign-up-inputs"
            type="text"
            name="username"
            onChange={updateUsername}
            value={username}
            required
          ></input>
        </div>

        <div>
          <label>First Name</label>
          <input
            id="sign-up-inputs"
            type="text"
            name="firstName"
            onChange={updateFirstName}
            value={firstName}
            required
          ></input>
        </div>
        <div>
          <label>Last Name</label>
          <input
            id="sign-up-inputs"
            type="text"
            name="lastName"
            onChange={updateLastName}
            value={lastName}
            required
          ></input>
        </div>
        <div>
          <label>Email</label>
          <input
            id="sign-up-inputs"
            type="text"
            name="email"
            onChange={updateEmail}
            value={email}
            required
          ></input>
        </div>

        <div>
          <label>Password</label>
          <input
            id="sign-up-inputs"
            type="password"
            name="password"
            onChange={updatePassword}
            value={password}
            required
          ></input>
        </div>
        <div>
          <label>Repeat Password</label>
          <input
            id="sign-up-inputs"
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
