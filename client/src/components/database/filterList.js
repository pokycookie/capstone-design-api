import { useEffect, useState } from "react";

export function FilterList(props) {
  const [check, setCheck] = useState(false);
  const [equal, setEqual] = useState(false);
  const [gt, setGt] = useState(false);
  const [lt, setLt] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    let option = { value };
    option.equal = equal;
    option.gt = gt;
    option.lt = lt;

    if (equal === false && gt === false && lt === false) {
      option = false;
    }

    const temp = props.filterOption;
    if (temp[props.index] !== option) {
      temp[props.index] = check === false ? false : option;
      props.setFilterOption([...temp]);
    }
  }, [props, check, equal, gt, lt, value]);

  return (
    <li className="sortList">
      <div className="sortList-left">
        <input
          className="sortList-element sortList-checkbox"
          value={check}
          onChange={({ target }) => setCheck(target.checked)}
          type="checkbox"
        />
        <p className="sortList-element sortList-content">{props.content}</p>
      </div>
      <div className="sortList-right">
        <div className="sortList-option">
          <div
            onClick={() => {
              if (check === true) {
                if (lt === false) {
                  setLt(true);
                  setGt(false);
                } else {
                  setLt(false);
                }
              }
            }}
            style={
              check === true && lt === true
                ? { backgroundColor: "#1b2433", color: "white" }
                : { backgroundColor: "white" }
            }
          >
            <p>&lt;</p>
          </div>
          <div
            onClick={() => {
              if (check === true) {
                if (gt === false) {
                  setLt(false);
                  setGt(true);
                } else {
                  setGt(false);
                }
              }
            }}
            style={
              check === true && gt === true
                ? { backgroundColor: "#1b2433", color: "white" }
                : { backgroundColor: "white" }
            }
          >
            <p>&gt;</p>
          </div>
          <div
            onClick={() => {
              if (check === true) {
                setEqual(equal === true ? false : true);
              }
            }}
            style={
              check === true && equal === true
                ? { backgroundColor: "#1b2433", color: "white" }
                : { backgroundColor: "white" }
            }
          >
            <p>=</p>
          </div>
        </div>
        <input
          className="sortList-input"
          type="number"
          value={value}
          onChange={({ target }) => {
            setValue(target.value);
          }}
        />
      </div>
    </li>
  );
}
