import { useEffect, useState } from "react";

function compareObj(obj1, obj2) {
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  if (
    obj1.check === obj2.check &&
    obj1.equal === obj2.equal &&
    obj1.gt === obj2.gt &&
    obj1.lt === obj2.lt &&
    obj1.value === obj2.value
  ) {
    return true;
  } else {
    return false;
  }
}

export function FilterList(props) {
  const [check, setCheck] = useState(false);
  const [equal, setEqual] = useState(false);
  const [gt, setGt] = useState(false);
  const [lt, setLt] = useState(false);
  const [value, setValue] = useState(props.index === 3 ? new Date() : 0);

  useEffect(() => {
    let option = { check, equal, gt, lt, value };

    if (equal === false && gt === false && lt === false) {
      option.check = false;
    }

    const temp = props.filterOption;
    if (!compareObj(temp[props.index], option)) {
      temp[props.index] = option;
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
