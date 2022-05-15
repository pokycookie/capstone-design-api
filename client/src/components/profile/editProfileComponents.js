import axios from "axios";
import { useState } from "react";
import { URI } from "../../App";

export function EditProfileComponents({ login, setLogin }) {
  const [nickname, setNickname] = useState(login.nickname);
  const [image, setImage] = useState("");
  const [PW, setPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [verifyPW, setVerifyPW] = useState("");
  const [PWError, setPWError] = useState(false);

  const updateNickname = () => {
    if (typeof nickname === "string" && nickname.length > 0) {
      axios
        .post(`${URI}/nickname`, {
          id: login._id,
          nickname,
        })
        .then(() => {
          axios
            .get(`${URI}/nickname/${login._id}`)
            .then((res) => {
              const temp = { ...login };
              temp.nickname = res.data;
              setLogin(temp);
            })
            .catch((err) => {
              console.error(err);
            });
        });
    }
  };

  const updateImage = () => {
    if (typeof image === "string") {
      axios
        .post(`${URI}/image`, {
          id: login._id,
          image,
        })
        .then(() => {
          axios
            .get(`${URI}/image/${login._id}`)
            .then((res) => {
              const temp = { ...login };
              temp.image = res.data;
              setLogin(temp);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const updatePW = () => {
    if (PW === null || PW === "") {
      setPWError("Enter your password");
    } else if (newPW === null || newPW === "") {
      setPWError("Enter your new password");
    } else if (verifyPW === null || verifyPW === "") {
      setPWError("Enter your password again");
    } else if (newPW !== verifyPW) {
      setPWError("Please check your Confirm PW");
    } else {
      setPWError(false);
      axios
        .post(`${URI}/password`, {
          id: login._id,
          password: PW,
          newPW: newPW,
        })
        .then((res) => {
          if (res.data === "incorrect") {
            setPWError("Current password is incorrect");
          } else {
            window.alert("비밀번호가 성공적으로 변경되었습니다.");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="editProfileComponents">
      <div className="editProfile-area editProflie-nickname">
        <div className="editProfile-nav">
          <p>Nickname</p>
          <button className="editProfile-btn" onClick={updateNickname}>
            UPDATE
          </button>
        </div>
        <div className="editProfile-contents">
          <div className="editProfile-column">
            <p className="editProfile-text">Nickname</p>
            <input
              value={nickname}
              placeholder="Enter the nickname you want to change"
              onChange={({ target }) => {
                setNickname(target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="editProfile-area editProflie-password">
        <div className="editProfile-nav">
          <p>Password</p>
          <button className="editProfile-btn" onClick={updatePW}>
            UPDATE
          </button>
        </div>
        <div className="editProfile-contents">
          <div className="editProfile-column">
            <p className="editProfile-text">Current password</p>
            <input
              type="password"
              placeholder="Enter your original password"
              value={PW}
              onChange={({ target }) => {
                setPW(target.value);
              }}
            />
          </div>
          <div className="editProfile-column">
            <p className="editProfile-text">New password</p>
            <input
              type="password"
              placeholder="Enter the password you want to change"
              value={newPW}
              onChange={({ target }) => {
                setNewPW(target.value);
              }}
            />
          </div>
          <div className="editProfile-column">
            <p className="editProfile-text">Confirm new password</p>
            <input
              type="password"
              placeholder="Enter your original password again"
              value={verifyPW}
              onChange={({ target }) => {
                setVerifyPW(target.value);
              }}
            />
          </div>
          <div className="editProfile-column errorMsg">
            <p>{PWError !== false ? PWError : ""}</p>
          </div>
        </div>
      </div>
      <div className="editProfile-area editProflie-image">
        <div className="editProfile-nav">
          <p>Profile Image</p>
          <button className="editProfile-btn" onClick={updateImage}>
            UPDATE
          </button>
        </div>
        <div className="editProfile-contents">
          <div className="editProfile-column">
            <p className="editProfile-text">Image URL</p>
            <input
              placeholder="Enter the Image URL you want to use"
              value={image}
              onChange={({ target }) => {
                setImage(target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="editProfile-area editProflie-image">
        <div className="editProfile-nav">
          <p>Room</p>
          <button
            className="editProfile-btn"
            onClick={() => {
              window.alert("현재 지원하지 않는 기능입니다.");
            }}
          >
            UPDATE
          </button>
        </div>
        <div className="editProfile-contents">
          <div className="editProfile-column">
            <p className="editProfile-text">Room number</p>
            <input placeholder="Enter your room number" type="number" />
          </div>
        </div>
      </div>
    </div>
  );
}
