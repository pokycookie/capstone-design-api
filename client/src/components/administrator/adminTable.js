import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";

export function AdminTable({ DB }) {
  const [locationArr, setLocationArr] = useState([]);
  const [updatedArr, setUpdatedArr] = useState([]); // moment format: YYYY-MM-DD HH:mm
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (Array.isArray(DB)) {
      const tempLocation = [];
      const tempUpdated = [];
      const tempData = [];

      // tempLocation => Location
      DB.forEach((element) => {
        if (!tempLocation.includes(element.location)) {
          tempLocation.push(element.location);
        }
      });
      tempLocation.sort((a, b) => a - b);

      // tempUpdated => updatedArr
      DB.forEach((element) => {
        if (
          !tempUpdated.includes(
            moment(element.updated).format("YYYY-MM-DD HH:mm")
          )
        ) {
          tempUpdated.push(moment(element.updated).format("YYYY-MM-DD HH:mm"));
        }
      });
      tempUpdated.sort((a, b) => a - b);

      // tempData => srotedData
      tempUpdated.forEach((element) => {
        tempData.push(
          DB.filter(
            (E) => moment(E.updated).format("YYYY-MM-DD HH:mm") === element
          ).sort((a, b) => moment(a.location).diff(moment(b.location)))
        );
      });

      setLocationArr(tempLocation);
      setUpdatedArr(tempUpdated);
      setSortedData(tempData);
      console.log(tempLocation);
    } else {
      setLocationArr([]);
      setSortedData([]);
    }
  }, [DB]);

  return (
    <div className="adminTableArea">
      <ul
        className="adminTable-title"
        style={{
          gridTemplateColumns: `repeat(${locationArr.length + 1}, 1fr)`,
        }}
      >
        <li className="list">Updated</li>
        {Array.isArray(locationArr)
          ? locationArr.map((element, index) => {
              return (
                <li className="list" key={index}>
                  {element}
                </li>
              );
            })
          : null}
      </ul>
      <ul className="adminTable-ul">
        {Array.isArray(sortedData) && Array.isArray(locationArr)
          ? sortedData.map((element, index) => {
              return (
                <li
                  key={index}
                  className="list"
                  style={{
                    gridTemplateColumns: `repeat(${
                      locationArr.length + 1
                    }, 1fr)`,
                  }}
                >
                  <div className="list-div">
                    {moment(element[0].updated).format("YYYY-MM-DD HH:mm")}
                  </div>
                  {element.map((E, index) => {
                    return (
                      <div
                        key={index}
                        className="list-div"
                        style={{
                          gridColumn: `${
                            locationArr.findIndex(
                              (T) => T === parseInt(E.location)
                            ) + 2
                          } / ${
                            locationArr.findIndex(
                              (T) => T === parseInt(E.location)
                            ) + 3
                          }`,
                        }}
                      >
                        {E.sound}
                      </div>
                    );
                  })}
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}
