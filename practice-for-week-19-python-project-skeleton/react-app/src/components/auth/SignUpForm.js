import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { useSignUpForm } from "../../context/SignUpContext";
import { signUp } from "../../store/session";
import ProfileImageSubmit from "./ProfileImageSubmit";
import "./SignUpForm.css";
import SignUpFormText from "./SignUpFormText";

const SignUpForm = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    position, setPosition
  } = useSignUpForm();
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.allUsers);

  // const onSignUp = async (e) => {
  //   e.preventDefault();

  //   const awsImage = new FormData();
  //   awsImage.append("image", image);


  //   setImageLoading(true)
  //   // Additional API call to send image up to AWS
  //   const awsImageRes = await fetch('/api/images', {
  //     method: "POST",
  //     body: awsImage,
  //   })


  //   if (awsImageRes.ok) {
  //     await awsImageRes.json()
  //       .then(async (awaitedImage) => {
  //         setImageLoading(false)

  //         const imageUrl = await awaitedImage.url

  //         console.log('image url', imageUrl)

  //         const userData = {
  //           username,
  //           first_name: firstName,
  //           last_name: lastName,
  //           image_url: imageUrl,
  //           email,
  //           password,
  //         };

  //         console.log('user data', userData)

  //         if (validationErrors.length === 0) {
  //           const data = await dispatch(signUp(userData));
  //           if (data) {
  //             setValidationErrors(data);
  //           }
  //         } else {
  //         }
  //       })
  //   }


  // };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="sign-up-page">
      <div className='sign-up-carousel'>
        <div className='sign-up-inner' style={{ transform: `translateX(-${position * 100}%)` }}>
          <SignUpFormText
            setPosition={setPosition}
            position={position}
          />
          <ProfileImageSubmit
            // image={image}
            // setImage={setImage}
            setPosition={setPosition}
            position={position}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
