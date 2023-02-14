import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSignUpForm } from "../../context/SignUpContext";
import { signUp } from "../../store/session";

const SignUpFormText = () => {

  const [validationErrors, setValidationErrors] = useState(new Map());
  const {
    username, setUsername,
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    repeatPassword, setRepeatPassword,
    position, setPosition
  } = useSignUpForm();

  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.allUsers);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const next = async (e) => {
    let errors = new Map();

    if (username.length <= 4 || username.length >= 50) {
      errors.set(
        'user',
        "Username must be more than 4 characters and less than 50 characters "
      );
    }

    if (password.length <= 6 || password.length >= 50) {
      errors.set(
        'pass',
        "Password must be more than 6 characters and less than 50 characters "
      );
    }

    if (!validateEmail(email)) {
      errors.set(
        'email',
        "Email must be a valid email"
      );
    }

    if (password !== repeatPassword) {
      errors.set(
        'repeat',
        "Passwords must match"
      );
    }

    setValidationErrors(errors);

    console.log(errors)

    if (errors.size === 0) {
      setPosition(position + 1)
    }
    console.log()
  }

  const onSignUp = async (e) => {
    e.preventDefault();

    const awsImage = new FormData();
    awsImage.append("image", image);


    setImageLoading(true)
    // Additional API call to send image up to AWS
    const awsImageRes = await fetch('/api/images', {
      method: "POST",
      body: awsImage,
    })


    if (awsImageRes.ok) {
      await awsImageRes.json()
        .then(async (awaitedImage) => {
          setImageLoading(false)

          const imageUrl = await awaitedImage.url

          console.log('image url', imageUrl)

          const userData = {
            username,
            first_name: firstName,
            last_name: lastName,
            image_url: imageUrl,
            email,
            password,
          };

          console.log('user data', userData)

          if (validationErrors.length === 0) {
            const data = await dispatch(signUp(userData));
            if (data) {
              setValidationErrors(data);
            }
          } else {
          }
        })
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

  return (
    <div>
      <form className="sign-up-form-container" onSubmit={onSignUp}>
        <p id="sign-up-title">SIGN UP</p>

        <div class="sign-up-form">
          <div className="sign-up-input">
            {
              validationErrors.get('user') &&
              <p className="error">* {validationErrors.get('user')}</p>
            }
            <div>
              <label>User Name</label>
              <input
                className="sign-up-inputs"
                type="text"
                name="username"
                onChange={updateUsername}
                value={username}
                required
              ></input>
            </div>
          </div>

          <div className="sign-up-input">
            {
              validationErrors.first &&
              <p className="error">* {validationErrors.first}</p>
            }
            <div>
              <label>First Name</label>
              <input
                className="sign-up-inputs"
                type="text"
                name="firstName"
                onChange={updateFirstName}
                value={firstName}
                required
              ></input>
            </div>
          </div>
          <div className="sign-up-input">
            {
              validationErrors.last &&
              <p className="error">* {validationErrors.last}</p>
            }
            <div>
              <label>Last Name</label>
              <input
                className="sign-up-inputs"
                type="text"
                name="lastName"
                onChange={updateLastName}
                value={lastName}
                required
              ></input>
            </div>
          </div>
          <div className="sign-up-input">
            {
              validationErrors.get('email') &&
              <p className="error">* {validationErrors.get('email')}</p>
            }
            <div>
              <label>Email</label>
              <input
                className="sign-up-inputs"
                type="text"
                name="email"
                onChange={updateEmail}
                value={email}
                required
              ></input>
            </div>
          </div>
          <div className="sign-up-input">
            {
              validationErrors.get('pass') &&
              <p className="error">* {validationErrors.get('pass')}</p>
            }
            <div>
              <label>Password</label>
              <input
                className="sign-up-inputs"
                type="password"
                name="password"
                onChange={updatePassword}
                value={password}
                autoComplete='on'
                required
              ></input>
            </div>
          </div>
          <div className="sign-up-input">
            {
              validationErrors.get('repeat') &&
              <p className="error">* {validationErrors.get('repeat')}</p>
            }
            <div>
              <label>Repeat Password</label>
              <input
                className="sign-up-inputs"
                type="password"
                name="repeat_password"
                onChange={updateRepeatPassword}
                value={repeatPassword}
                required
                autoComplete='on'
              ></input>
            </div>
          </div>
        </div>
      </form >
      <button className="sign-up-button" onClick={next}>
        Next
      </button>
    </div>
  )
}

export default SignUpFormText
