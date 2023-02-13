import { createContext, useContext, useState } from "react";

export const SignUpContext = createContext();
export const useSignUpForm = () => useContext(SignUpContext)

export default function SignUpProvider(props) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [position, setPosition] = useState(0)

  return (
    <SignUpContext.Provider
      value={{
        username, setUsername,
        firstName, setFirstName,
        lastName, setLastName,
        email, setEmail,
        password, setPassword,
        repeatPassword, setRepeatPassword,
        position, setPosition
      }}
      >
        {props.children}
      </SignUpContext.Provider>
    )
}
