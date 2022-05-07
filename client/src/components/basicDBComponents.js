import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRotateRight} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {CheckBox} from "./checkBox";
import {SortList} from "./sortList";
import {FilterList} from "./filterList";

export function BasicDBComponents(props) {
  const [isAllCheck, setAllCheck] = useState(false);
  const [checkSet, setCheckSet] = useState(new Set());
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState([false, false, false, false]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOption, setFilterOption] = useState([
    false,
    false,
    false,
    false,
  ]);

  const filterText = (mode) => {
    const location = filterOption[0];
    const sound = filterOption[1];
    const vibration = filterOption[2];
    const updated = filterOption[3];

    const option = [];
    if (mode !== true) {
      filterOption.forEach((element, index) => {
        if (element !== false) {
          if (element.equal === true && element.gt === true) {
            option[index] = `$gte: ${element.value}`;
          } else if (element.equal === true && element.lt === true) {
            option[index] = `$lte: ${element.value}`;
          } else if (element.equal === true) {
            option[index] = `$equals: ${element.value}`;
          } else if (element.gt === true) {
            option[index] = `$gt: ${element.value}`;
          } else {
            option[index] = `$lt: ${element.value}`;
          }
        }
      });
      return `${location !== false ? `Location(${option[0]}) ` : ""}${
        sound !== false ? `Sound(${option[1]}) ` : ""
      }${vibration !== false ? `Vibration(${option[2]}) ` : ""}${
        updated !== false ? `Updated(${option[3]}) ` : ""
      }`;
    } else {
      filterOption.forEach((element, index) => {
        if (element !== false) {
          if (element.equal === true && element.gt === true) {
            option[index] = "$gte";
          } else if (element.equal === true && element.lt === true) {
            option[index] = "$lte";
          } else if (element.equal === true) {
            option[index] = "$equals";
          } else if (element.gt === true) {
            option[index] = "$gt";
          } else {
            option[index] = "$lt";
          }
        }
      });
      return option;
    }
  };

  const sortText = () => {
    const location = sortOption[0];
    const sound = sortOption[1];
    const vibration = sortOption[2];
    const updated = sortOption[3];

    return `${location !== false ? `Location(${location}) ` : ""}${
      sound !== false ? `Sound(${sound}) ` : ""
    }${vibration !== false ? `Vibration(${vibration}) ` : ""}${
      updated !== false ? `Updated(${updated})` : ""
    }`;
  };

  const refresh = () => {
    const option = {};
    const filterResult = filterText(true);

    if (sortOption[0] !== false) option.sortLocation = sortOption[0];
    if (sortOption[1] !== false) option.sortSound = sortOption[1];
    if (sortOption[2] !== false) option.sortVibration = sortOption[2];
    if (sortOption[3] !== false) option.sortUpdated = sortOption[3];

    if (filterOption[0] !== false) {
      option.filterLocation = filterOption[0].value;
      option.filterLocationFlag = filterResult[0];
    }
    if (filterOption[1] !== false) {
      option.filterSound = filterOption[1].value;
      option.filterSoundFlag = filterResult[1];
    }
    if (filterOption[2] !== false) {
      option.filterVibration = filterOption[2].value;
      option.filterVibrationFlag = filterResult[2];
    }
    if (filterOption[3] !== false) {
      option.filterUpdated = filterOption[3].value;
      option.filterUpdatedFlag = filterResult[3];
    }

    setAllCheck(false);
    setCheckSet(new Set());
    props.getData(option);
    setRefreshFlag(true);
  };

  return (
    <div className="basicDBArea">
      <div className="nav">
        <div className="nav-left">
          <button className="dbBtn refreshBtn" onClick={() => refresh()}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <div className="sortInput">
            <div className="sortInput-left">
              <p className="sortInput-left-title">Sort by :</p>
              <p className="sortInput-left-value">{sortText()}</p>
            </div>
            <button
              className="sortInputBtn"
              onClick={() => {
                if (sortOpen === true) {
                  setSortOpen(false);
                  if (props.login !== false) {
                    refresh();
                  }
                } else {
                  setSortOpen(true);
                }
              }}
            >
              {sortOpen === false ? "▼" : "▲"}
            </button>
            <ul
              className="sortMenu"
              style={
                sortOpen !== false
                  ? {height: `${30 * 4}px`}
                  : {visibility: "hidden"}
              }
            >
              <SortList
                sortOption={sortOption}
                setSortOption={setSortOption}
                index={0}
                content="Location"
              />
              <SortList
                sortOption={sortOption}
                setSortOption={setSortOption}
                index={1}
                content="Sound"
              />
              <SortList
                sortOption={sortOption}
                setSortOption={setSortOption}
                index={2}
                content="Vibration"
              />
              <SortList
                sortOption={sortOption}
                setSortOption={setSortOption}
                index={3}
                content="Updated"
              />
            </ul>
          </div>
          <div className="sortInput">
            <div className="sortInput-left">
              <p className="sortInput-left-title">Filter :</p>
              <p className="sortInput-left-value">{filterText()}</p>
            </div>
            <button
              className="sortInputBtn"
              onClick={() => {
                if (filterOpen === true) {
                  setFilterOpen(false);
                  if (props.login !== false) {
                    refresh();
                  }
                } else {
                  setFilterOpen(true);
                }
              }}
            >
              {filterOpen === false ? "▼" : "▲"}
            </button>
            <ul
              className="sortMenu"
              style={
                filterOpen !== false
                  ? {height: `${30 * 4}px`}
                  : {visibility: "hidden"}
              }
            >
              <FilterList
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                index={0}
                content="Location"
              />
              <FilterList
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                index={1}
                content="Sound"
              />
              <FilterList
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                index={2}
                content="Vibration"
              />
              <FilterList
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                index={3}
                content="Updated"
              />
            </ul>
          </div>
        </div>
        <div className="nav-right">
          <button
            className="dbBtn"
            onClick={() => {
              props.setUpdateDataModal(true);
            }}
          >
            UPLOAD
          </button>
          <button
            className="dbBtn delete"
            onClick={() => {
              props.deleteData(Array.from(checkSet));
              refresh();
            }}
          >
            DELETE
          </button>
        </div>
      </div>
      <div className="dbList DBtitle">
        <div className="dbElement">
          <input
            type="checkbox"
            checked={isAllCheck}
            onChange={({target}) => {
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
