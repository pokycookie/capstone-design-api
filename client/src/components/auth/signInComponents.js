import axios from "axios";
import { useState } from "react";
import { URI } from "../../App";

export function SignInComponents(prop) {
  const [authError, setAuthError] = useState("");
  const props = prop.property;

  return (
    <div className="authSection authRight">
      <p className="authTitle">SIGN IN</p>
      <div className="inputArea">
        <p>ID</p>
        <input
          className="IDinput"
          placeholder="Input your ID"
          onChange={({ target }) => props.setInputID(target.value)}
        />
      </div>
      <div className="inputArea">
        <p>PW</p>
        <input
          className="PWinput"
          placeholder="Input your Password"
          onChange={({ target }) => props.setInputPW(target.value)}
          type="password"
        />
      </div>
      <p className="authError">{authError}</p>
      <button
        className="loginBtn"
        onClick={() => {
          if (props.inputID === null || props.inputID === "") {
            console.log("NO ID");
            setAuthError("Please enter your ID");
          } else if (props.inputPW === null || props.inputPW === "") {
            console.log("NO PW");
            setAuthError("Please enter your PW");
          } else {
            axios
              .post(`${URI}/login`, {
                id: props.inputID,
                pw: props.inputPW,
              })
              .then((res) => {
                if (res.data.info === "Success") {
                  props.setLogin(res.data.user);
                } else {
                  setAuthError(res.data);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }}
      >
        LOGIN
      </button>
      <p
        className="signupBtn"
        onClick={() => {
          props.setIsSignIn(false);
        }}
      >
        SIGN UP
      </p>
    </div>
  );
}
