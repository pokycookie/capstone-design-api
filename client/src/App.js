import axios from "axios";
import { useEffect, useState } from "react";
import { AuthComponents } from "./components/authComponents";
import { BottomNavComponents } from "./components/bottomNavComponents";
import { CoreComponents } from "./components/coreComponents";

export const URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : process.env.REACT_APP_HOST;

export function App() {
  const [login, setLogin] = useState(false);

  // useEffect(() => {
  //   axios
  //     .post(`${URI}/login`)
  //     .then((res) => {
  //       setLogin(res.data.user);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="App">
      <CoreComponents login={login} />
      <BottomNavComponents login={login} />
      {login === false ? (
        <AuthComponents setLogin={setLogin} login={login} />
      ) : null}
    </div>
  );
}
