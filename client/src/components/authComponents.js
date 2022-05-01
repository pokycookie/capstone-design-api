import axios from "axios";
import { useEffect, useState } from "react";
import { URI } from "../App";

export function AuthComponents(props) {
  const [inputID, setInputID] = useState(null);
  const [inputPW, setInputPW] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {});

  return (
    <div className="Auth">
      <div className="authArea">
        <div className="authSection authLeft">
          <p>PKNU CAPSTONE DESIGN APP</p>
          <p className="description">
            본 페이지는 PKNU 2022 CAPSTONE DESIGN 프로젝트를 위해
            만들어졌습니다. 해당 서비스를 이용하기 위해서는 로그인이 필요합니다.
            단, 현재 회원가입 절차는 공식적으로 지원하고 있지 않습니다. 따라서
            계정 생성 문의는 0cookieboy0@pukyong.ac.kr로 문의해 주시기 바랍니다.
          </p>
        </div>
        <div className="authSection authRight">
          <p className="authTitle">SIGN IN</p>
          <div className="IDArea inputArea">
            <p>ID</p>
            <input
              className="IDinput"
              placeholder="Input your ID"
              onChange={({ target }) => setInputID(target.value)}
            />
          </div>
          <div className="IDArea inputArea">
            <p>PW</p>
            <input
              className="PWinput"
              placeholder="Input your Password"
              onChange={({ target }) => setInputPW(target.value)}
              type="password"
            />
          </div>
          <p className="authError">{authError}</p>
          <button
            className="loginBtn"
            onClick={() => {
              if (inputID === null || inputID === "") {
                console.log("NO ID");
                setAuthError("Please enter your ID");
              } else if (inputPW === null || inputPW === "") {
                console.log("NO PW");
                setAuthError("Please enter your PW");
              } else {
                axios
                  .post(`${URI}/login`, {
                    id: inputID,
                    pw: inputPW,
                  })
                  .then((res) => {
                    if (res.data.info === "Success") {
                      props.setLogin(res.data.user);
                    } else {
                      setAuthError(res.data.info);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                // axios.post(`${URI}/admin`).then().catch();
              }
            }}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
