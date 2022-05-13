import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { URI } from "../../App";

const transTime = (time) => {
  return time >= 10 ? time : `0${time}`;
};

export function HistoryComponents(props) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = () => {
    axios
      .get(`${URI}/history`)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="historyArea">
      <div className="btnArea">
        <button
          className="refreshBtn"
          onClick={() => {
            getHistory();
          }}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
        {(props.login !== false && props.login.securityLevel) === 0 ? (
          <div className="masterOption">
            <button
              onClick={() => {
                props.setUpdateHistory(true);
              }}
            >
              UPLOAD
            </button>
            <button className="deleteBtn">DELETE</button>
          </div>
        ) : null}
      </div>
      <ul className="historyUl">
        {Array.isArray(history)
          ? history.map((element, index) => {
              return (
                <li className="historyList" key={index}>
                  <p className="historyList-content">{element.content}</p>
                  <p className="historyList-date">{`${transTime(
                    element.year
                  )}.${transTime(element.month)}.${transTime(
                    element.date
                  )}`}</p>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}
