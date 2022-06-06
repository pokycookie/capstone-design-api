import { useEffect, useState } from "react";

export function SortList(props) {
  const [check, setCheck] = useState(false);
  const [option, setOption] = useState("false");

  useEffect(() => {
    const temp = props.sortOption;
    if (temp[props.content] !== option) {
      temp[props.content] = option;
      props.setSortOption({ ...temp });
    }
  }, [option, check, props]);

  return (
    <li className="sortList">
      <div className="sortList-left">
        <input
          className="sortList-element sortList-checkbox"
          value={check}
          onChange={({ target }) => {
            setCheck(target.checked);
            setOption(`${target.checked ? "asc" : "false"}`);
          }}
          type="checkbox"
        />
        <p className="sortList-element sortList-content">{props.content}</p>
      </div>
      <div className="sortList-option">
        <div
          onClick={() => {
            if (check === true) {
              setOption("asc");
            }
          }}
          style={
            check === true && option === "asc"
              ? { backgroundColor: "#1b2433", color: "white" }
              : { backgroundColor: "white" }
          }
        >
          <p>ASC</p>
        </div>
        <div
          onClick={() => {
            if (check === true) {
              setOption("desc");
            }
          }}
          style={
            check === true && option === "desc"
              ? { backgroundColor: "#1b2433", color: "white" }
              : { backgroundColor: "white" }
          }
        >
          <p>DESC</p>
        </div>
      </div>
    </li>
  );
}
