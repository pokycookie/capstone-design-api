import axios from "axios";
import { useEffect, useState } from "react";
import { BasicDBComponents } from "./components/basicDBComponents";
import { PostDBComponents } from "./components/postDBComponents";

function App() {
  const [DB, setDB] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_HOST}/api/data`)
      .then((res) => {
        setDB(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const postData = (location, sound, vibration) => {
    if (location === false || sound === false || vibration === false) {
      console.log(location, sound, vibration);
      return;
    }

    axios
      .post(`${process.env.REACT_APP_HOST}/api/data`, {
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
  };

  const deleteData = (idArr) => {
    if (Array.isArray(idArr)) {
      idArr.forEach((id) => {
        axios
          .delete(`${process.env.REACT_APP_HOST}/api/data/${id}`)
          .then(() => {
            console.log("DELETE OK");
          })
          .catch((err) => {
            console.error(err);
          });
        getData();
      });
    } else {
      console.error("You must use Array type for delete method's parameter");
    }
  };

  return (
    <div className="App">
      <div></div>
      <BasicDBComponents DB={DB} getData={getData} deleteData={deleteData} />
      <PostDBComponents postData={postData} />
    </div>
  );
}

export default App;
