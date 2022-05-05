import { useState } from "react";
import { CheckBox } from "./checkBox";

export function BasicDBComponents(props) {
  const [isAllCheck, setAllCheck] = useState(false);
  const [checkSet, setCheckSet] = useState(new Set());
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refresh = () => {
    setAllCheck(false);
    setCheckSet(new Set());
    props.getData();
    setRefreshFlag(true);
  };

  return (
    <div className="basicDBArea">
      <div className="nav">
        <button onClick={() => refresh()}>Refresh</button>
        <button
          onClick={() => {
            props.deleteData(Array.from(checkSet));
            refresh();
          }}
        >
          Delete
        </button>
      </div>
      <div className="dbList DBtitle">
        <div className="dbElement">
          <input
            type="checkbox"
            checked={isAllCheck}
            onChange={({ target }) => {
              if (target.checked) {
                setCheckSet(new Set(props.DB.map((element) => element._id)));
              } else {
                setCheckSet(new Set());
              }
              setAllCheck(target.checked);
            }}
            className="checkbox"
          />
        </div>
        <p className="dbElement dbTitleElement">Location</p>
        <p className="dbElement dbTitleElement">Sound</p>
        <p className="dbElement dbTitleElement">Vibration</p>
        <p className="dbElement dbTitleElement">Updated</p>
      </div>
      <ul className="dbListArea">
        {props.DB.map((element, index) => {
          return (
            <li className="dbList" key={index}>
              <div className="dbElement">
                <CheckBox
                  className="checkbox"
                  setCheckSet={setCheckSet}
                  checkSet={checkSet}
                  element={element}
                  isAllCheck={isAllCheck}
                  refreshFlag={refreshFlag}
                  setRefreshFlag={setRefreshFlag}
                />
              </div>
              <p className="dbElement">{element.location}</p>
              <p className="dbElement">{element.sound}</p>
              <p className="dbElement">{element.vibration}</p>
              <p className="dbElement">{element.updated}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
