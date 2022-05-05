import axios from "axios";
import { useState } from "react";
import { URI } from "../../App";

export function UpdateHistoryComponents(props) {
  const [content, setContent] = useState();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [date, setDate] = useState(new Date().getDate());

  const postHistory = (content, year, month, date) => {
    axios
      .post(`${URI}/history`, {
        content,
        year,
        month,
        date,
      })
      .then((res) => {
        console.log("history updated");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="updateHistoryAreaBack">
      <div className="updateHistoryArea">
        <textarea
          cols="30"
          rows="10"
          onChange={({ target }) => {
            setContent(target.value);
          }}
        ></textarea>
        <div className="dateInput">
          <input
            placeholder="year"
            type="number"
            value={year}
            onChange={({ target }) => {
              setYear(target.value);
            }}
          />
          <input
            placeholder="month"
            type="number"
            value={month}
            onChange={({ target }) => {
              setMonth(target.value);
            }}
          />
          <input
            placeholder="date"
            type="number"
            value={date}
            onChange={({ target }) => {
              setDate(target.value);
            }}
          />
        </div>
        <div className="btnArea">
          <button
            onClick={() => {
              postHistory(content, year, month, date);
            }}
          >
            UPLOAD
          </button>
          <button
            onClick={() => {
              props.setUpdateHistory(false);
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
