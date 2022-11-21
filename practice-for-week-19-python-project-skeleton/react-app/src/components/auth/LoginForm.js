import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../store/session";
import { getServers } from "../../store/servers";
import "./LoginForm.css";

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
    dispatch(getServers());
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <form class="login-form-container" onSubmit={onLogin}>
      <p id="login-title">LOGIN</p>
      <div class="errors">
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>

      <div class="login-form">
        <div className="width-100">
          <label htmlFor="email">Email</label>
          <input
            id="login-inputs"
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div className="width-100">
          <label htmlFor="password">Password</label>
          <input
            id="login-inputs"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
          />
        </div>
        <div>
          <button id="login-button" type="submit">
            LOGIN
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
