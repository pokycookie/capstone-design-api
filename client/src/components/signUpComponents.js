import axios from "axios";
import { useState } from "react";
import { URI } from "../App";

export function SignUpComponents(prop) {
  const props = prop.property;
  const [authError, setAuthError] = useState("");

  return (
    <div className="authSection authRight">
      <p className="authTitle">SIGN UP</p>
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
      <div className="inputArea">
        <p>Confirm PW</p>
        <input
          className="verifyPWinput"
          placeholder="Input your Password one more"
          onChange={({ target }) => props.setVerifyPW(target.value)}
          type="password"
        />
      </div>
      <div className="inputArea">
        <p>Nickname</p>
        <input
          className="PWinput"
          placeholder="Input your Nickname"
          onChange={({ target }) => props.setNickname(target.value)}
        />
      </div>
      <div className="inputArea">
        <p>Authentication code</p>
        <input
          className="PWinput"
          placeholder="Input your authentication code"
          onChange={({ target }) => props.setInputKey(target.value)}
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
          } else if (props.verifyPW === null || props.verifyPW === "") {
            console.log("NO PW");
            setAuthError("Please enter your Confirm PW");
          } else if (props.nickname === null || props.nickname === "") {
            console.log("NO PW");
            setAuthError("Please enter your Nickname");
          } else if (props.inputKey === null || props.inputKey === "") {
            console.log("NO PW");
            setAuthError("Please enter your Authentication code");
          } else if (props.inputPW !== props.verifyPW) {
            setAuthError("Please check your Confirm PW");
          } else {
            axios
              .post(`${URI}/signup`, {
                id: props.inputID,
                pw: props.inputPW,
                nickname: props.nickname,
                inputKey: props.inputKey,
              })
              .then((res) => {
                if (res.data.info === "Success") {
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
                } else {
                  setAuthError(res.data.info);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }}
      >
        SIGN UP
      </button>
      <p
        className="signupBtn"
        onClick={() => {
          props.setIsSignIn(true);
        }}
      >
        SIGN IN
      </p>
    </div>
  );
}
