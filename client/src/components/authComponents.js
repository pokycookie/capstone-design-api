import { useEffect, useState } from "react";
import { SignInComponents } from "./signInComponents";
import { SignUpComponents } from "./signUpComponents";

export function AuthComponents(props) {
  const [inputID, setInputID] = useState(null);
  const [inputPW, setInputPW] = useState(null);
  const [verifyPW, setVerifyPW] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [inputKey, setInputKey] = useState(null);
  const [isSignIn, setIsSignIn] = useState(true);

  const property = {
    inputID,
    inputPW,
    verifyPW,
    nickname,
    inputKey,
    isSignIn,
    setLogin: props.setLogin,
    setInputID,
    setInputPW,
    setVerifyPW,
    setNickname,
    setInputKey,
    setIsSignIn,
  };

  return (
    <div className="Auth">
      <div className="authArea">
        <div className="authSection authLeft">
          <p>PKNU CAPSTONE DESIGN APP</p>
          <p className="description">
            본 페이지는 PKNU 2022 CAPSTONE DESIGN 프로젝트를 위해
            만들어졌습니다. 서비스를 이용하기 위해서는 로그인이 필요합니다. 단,
            현재 회원가입은 인증 코드를 발급받은 회원에 한해서만 가능합니다.
            계정 생성을 위한 인증코드 발급 문의는 0cookieboy0@pukyong.ac.kr로
            문의해 주시기 바랍니다.
          </p>
        </div>
        {isSignIn === true ? (
          <SignInComponents property={property} />
        ) : (
          <SignUpComponents property={property} />
        )}
      </div>
    </div>
  );
}
