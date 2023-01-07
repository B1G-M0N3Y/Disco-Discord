import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import ProfileImageSubmit from "./ProfileImageSubmit";
import "./SignUpForm.css";

const SignUpForm = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [position, setPosition] = useState(0)
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

  const next = async (e) => {
    let errors = {};

    if (username.length <= 4 || username.length >= 50) {
      errors.user =
        "Username must be more than 4 characters and less than 50 characters "
    }

    if (password.length <= 6 || password.length >= 50) {
      errors.pass =
        "Password must be more than 6 characters and less than 50 characters "
    }

    if (!validateEmail(email)) {
      errors.email = "Email must be a valid email"
    }

    if (password !== repeatPassword) {
      errors.repeat = "Passwords must match";
    }

    setValidationErrors(errors);

    if (errors.length === 0) {
      setPosition(position + 1)
    }
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

  const updateImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

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

  const TextSubmit = () => (
    <>
      <form className="sign-up-form-container" onSubmit={onSignUp}>
        <p id="sign-up-title">SIGN UP</p>
        {/* <div className="sign-up-errors">
          {validationErrors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div> */}

        <div class="sign-up-form">
          <div className="sign-up-input">
            {
              validationErrors.user &&
              <p className="error">* {validationErrors.user}</p>
            }
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
          </div>

          <div className="sign-up-input">
            {
              validationErrors.first &&
              <p className="error">* {validationErrors.first}</p>
            }
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
          </div>
          <div className="sign-up-input">
            {
              validationErrors.last &&
              <p className="error">* {validationErrors.last}</p>
            }
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
          </div>
          <div className="sign-up-input">
            {
              validationErrors.email &&
              <p className="error">* {validationErrors.email}</p>
            }
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
          </div>
          <div className="sign-up-input">
            {
              validationErrors.pass &&
              <p className="error">* {validationErrors.pass}</p>
            }
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
          </div>
          <div className="sign-up-input">
            {
              validationErrors.repeat &&
              <p className="error">* {validationErrors.repeat}</p>
            }
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
          </div>
        </div>
        <button className="sign-up-button" onClick={next}>
          Next
        </button>
      </form >
    </>
  )

  return (
    <div className="sign-up-page">
      <div className='sign-up-carousel'>
        <div className='sign-up-inner' style={{ transform: `translateX(-${position * 100}%)` }}>
          <TextSubmit />
          <ProfileImageSubmit
            image={image}
            setImage={setImage}
            setPosition={setPosition}
            position={position}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
