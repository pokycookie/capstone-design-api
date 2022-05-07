import axios from "axios";
import { useEffect, useState } from "react";
import { URI } from "../../App";

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
        {(props.login !== false && props.login.securityLevel) === 0 ? (
          <button
            onClick={() => {
              props.setUpdateHistory(true);
            }}
          >
            UPLOAD
          </button>
        ) : null}
        <button
          onClick={() => {
            getHistory();
          }}
        >
          UPDATE
        </button>
      </div>
      <ul className="historyUl">
        {Array.isArray(history)
          ? history.map((element, index) => {
              return (
                <li className="historyList" key={index}>
                  <p className="historyList-content">{element.content}</p>
                  <p className="historyList-date">{`${element.year}.${element.month}.${element.date}`}</p>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}
