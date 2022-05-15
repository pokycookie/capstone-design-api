import axios from "axios";
import { useState } from "react";
import { URI } from "../App";

const translateLevel = (level) => {
  switch (level) {
    case 0:
      return "Master";
    case 1:
      return "Administrator";
    case 2:
      return "Arduino";
    case 3:
      return "Client";
    default:
      break;
  }
};

export function NavComponents(props) {
  const [userMenu, setUserMenu] = useState(false);

  const onImgError = ({ target }) => {
    target.src =
      "https://shepherdswellcoldred-pc.gov.uk/wp-content/uploads/2020/08/male_default_councillor_image.jpg";
  };

  return (
    <div className="navArea">
      <div className="profileArea">
        <div className="profile">
          <img
            src={props.login.image}
            className="userImg"
            onError={onImgError}
          />
          <div className="userNicknameArea">
            <div className="userNickname">
              {props.login === false ? "Login" : props.login.nickname}
            </div>
            <p
              className="userMenu"
              onClick={() => {
                userMenu === true ? setUserMenu(false) : setUserMenu(true);
              }}
            >
              {userMenu === true ? "▲" : "▼"}
            </p>
          </div>
          <div className="userLevel">
            {props.login === false
              ? "Login"
              : translateLevel(props.login.securityLevel)}
          </div>
        </div>
      </div>
      <div
        className="userMenuArea"
        style={
          userMenu === true
            ? { height: props.login.securityLevel === 0 ? "200px" : "150px" }
            : null
        }
      >
        <p className="userMenuAreaTitle">USER MENU</p>
        <button
          onClick={() => {
            props.setMenu("editProfile");
          }}
        >
          <p>Edit Profile</p>
        </button>
        {props.login !== false && props.login.securityLevel === 0 ? (
          <button>
            <p>Master</p>
          </button>
        ) : null}
        <button
          onClick={() => {
            axios
              .get(`${URI}/logout`)
              .then(() => {
                props.setLogin(false);
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          <p>Logout</p>
        </button>
      </div>
      <div className="menuArea">
        <div className="menuAreaTitle">APP MENU</div>
        <ul>
          <li
            className="menuAreaList"
            onClick={() => {
              props.setMenu("dashboard");
            }}
            style={
              props.menu === "dashboard" ? { backgroundColor: "#3e497a" } : null
            }
          >
            DASHBOARD
          </li>
          <li
            className="menuAreaList"
            onClick={() => {
              props.setMenu("analytics");
            }}
            style={
              props.menu === "analytics" ? { backgroundColor: "#3e497a" } : null
            }
          >
            ANALYTICS
          </li>
          <li
            className="menuAreaList"
            onClick={() => {
              props.setMenu("database");
            }}
            style={
              props.menu === "database" ? { backgroundColor: "#3e497a" } : null
            }
          >
            DATABASE
          </li>
          <li
            className="menuAreaList"
            onClick={() => {
              props.setMenu("history");
            }}
            style={
              props.menu === "history" ? { backgroundColor: "#3e497a" } : null
            }
          >
            UPDATE HISTORY
          </li>
        </ul>
      </div>
    </div>
  );
}
