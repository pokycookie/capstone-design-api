import axios from "axios";
import { useEffect, useState } from "react";
import { URI } from "../App";
import { BasicDBComponents } from "./basicDBComponents";
import { PostDBComponents } from "./postDBComponents";
import { HistoryComponents } from "./history/historyComponents";

export function CoreComponents(props) {
  const [DB, setDB] = useState([]);
  const [updateDataModal, setUpdateDataModal] = useState(false);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.login]);

  const getData = () => {
    if (props.login !== false) {
      axios
        .get(`${URI}/api/data`)
        .then((res) => {
          setDB(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const postData = (location, sound, vibration) => {
    if (location === false || sound === false || vibration === false) {
      console.log(location, sound, vibration);
      return;
    }
    if (props.login !== false) {
      axios
        .post(`${URI}/api/data`, {
          location,
          sound,
          vibration,
          updated: new Date(),
          auth: process.env.REACT_APP_AUTH_KEY,
        })
        .then(() => {
          getData();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const deleteData = (idArr) => {
    if (props.login !== false) {
      if (Array.isArray(idArr)) {
        idArr.forEach((id) => {
          axios
            .delete(`${URI}/api/data/${id}`)
            .then(() => {
              console.log("DELETE");
            })
            .catch((err) => {
              console.error(err);
            });
          getData();
        });
      } else {
        console.error("You must use Array type for delete method's parameter");
      }
    }
  };

  return (
    <div className="mainArea">
      <div className="title">
        <p>2022 PKNU CAPSTONE DESIGN APP</p>
      </div>
      <div className="contentArea">
        {props.menu === "history" ? (
          <HistoryComponents
            login={props.login}
            setUpdateHistory={props.setUpdateHistory}
          />
        ) : null}
        {props.menu === "alldb" ? (
          <BasicDBComponents
            DB={DB}
            getData={getData}
            deleteData={deleteData}
            setUpdateDataModal={setUpdateDataModal}
          />
        ) : null}
        {updateDataModal === true ? (
          <PostDBComponents
            postData={postData}
            setUpdateDataModal={setUpdateDataModal}
          />
        ) : null}
      </div>
    </div>
  );
}
