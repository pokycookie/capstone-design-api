import axios from "axios";
import { useEffect, useState } from "react";
import { AuthComponents } from "./components/authComponents";
import { CoreComponents } from "./components/coreComponents";
import { UpdateHistoryComponents } from "./components/history/updateHistoryComponents";
import { NavComponents } from "./components/navCompornent";

export const URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : process.env.REACT_APP_HOST;

export function App() {
  const [login, setLogin] = useState(false);
  const [menu, setMenu] = useState("dashboard");
  const [updateHistory, setUpdateHistory] = useState(false);

  axios.defaults.withCredentials = true;

  const checkLogin = () => {
    axios
      .get(`${URI}/auth`)
      .then((res) => {
        if (res !== false) {
          setLogin(res.data);
        } else {
          setLogin(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div className="App">
      <nav style={login === false ? { filter: `blur(5px)` } : null}>
        <NavComponents
          login={login}
          setLogin={setLogin}
          menu={menu}
          setMenu={setMenu}
        />
      </nav>
      <main style={login === false ? { filter: `blur(5px)` } : null}>
        <CoreComponents
          login={login}
          menu={menu}
          setUpdateHistory={setUpdateHistory}
        />
      </main>
      {login === false ? (
        <AuthComponents setLogin={setLogin} login={login} />
      ) : null}
      {updateHistory === true ? (
        <UpdateHistoryComponents setUpdateHistory={setUpdateHistory} />
      ) : null}
    </div>
  );
}
