import {
  faMagnifyingGlass,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { URI } from "../../App";
import { AnalyticsArcGraph } from "../analytics/anaylticsArcGraph";
import { DashboardTable } from "./dashboardTable";
import { GraphComponents } from "./graphComponents";

const defaultSet = new Set();
defaultSet.add("bar");
defaultSet.add("line");
defaultSet.add("dot");

export const DashboardComponents = () => {
  const [DB, setDB] = useState();
  const [location, setLocation] = useState(101);
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, "h").add(1, "m").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(1, "m").toISOString()
  );
  const [graphCount, setGraphCount] = useState(30);
  const [soundPercent, setSoundPercent] = useState(0);
  const [soundRank, setSoundRank] = useState(0);

  // useEffect(() => {
  //   console.log(`soundPercent: ${soundPercent}`);
  //   console.log(`soundRank: ${soundRank}`);
  // }, [soundPercent, soundRank]);

  const getRank = () => {
    axios
      .get(`${URI}/api/data`, {
        params: {
          $filter_updated: `$gte ${startDate} $lte ${endDate}`,
          $orderby_updated: "asc",
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          const filteredData = res.data
            .filter((e) => e.location === parseInt(location))
            .map((e) => {
              const postSound = e.postSound < 0 ? 0 : e.postSound;
              return (postSound / e.sound) * 100;
            });

          const soundPercentResult =
            filteredData.reduce((prev, curr) => {
              return prev + curr;
            }, 0) / filteredData.length;

          // setSoundPercent
          setSoundPercent(soundPercentResult);

          // setSoundRank
          const locationArr = [];
          const tempArr = [];

          res.data.forEach((element) => {
            if (!locationArr.includes(element.location)) {
              locationArr.push(element.location);
            }
          });
          locationArr.sort((a, b) => a - b);

          locationArr.forEach((L) => {
            const a = res.data
              .filter((E) => E.location === parseInt(L))
              .map((V) => {
                const postSound = V.postSound < 0 ? 0 : V.postSound;
                return (postSound / V.sound) * 100;
              });
            tempArr.push(
              a.reduce((prev, curr) => {
                return prev + curr;
              }, 0) / a.length
            );
          });
          tempArr.sort((a, b) => b - a);

          const tempRank =
            tempArr.findIndex((I) => I === soundPercentResult) + 1;

          setSoundRank((tempRank / tempArr.length) * 100);
        }
      })
      .catch((err) => console.error(err));
  };

  const getDB = (params) => {
    axios
      .get(`${URI}/api/data`, { params })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDB([...res.data]);
          setGraphCount(res.data.length > 30 ? 30 : res.data.length);
        }
      })
      .catch((err) => console.error(err));
  };

  const query = {
    $filter_updated: `$gte ${startDate} $lte ${endDate}`,
    $filter_location: `$equals ${location}`,
    $orderby_updated: "asc",
  };

  useEffect(() => {
    getDB(query);
    getRank();
    // eslint-disable-next-line
  }, [location]);

  return (
    <div className="dashboardComponents">
      <div className="dashboardNav">
        <div className="dashboardNav-left">
          <button
            className="graphBtn refreshBtn"
            onClick={() => {
              getDB(query);
              getRank();
              setEndDate(moment(new Date()).add(1, "m").toISOString());
            }}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <input
            className="graphLocationInput location"
            type="number"
            placeholder="Location"
            value={location}
            onChange={({ target }) => setLocation(target.value)}
          />
          <p>호</p>
        </div>
        <div className="dashboardNav-right">
          <button
            className="graphBtn refreshBtn"
            onClick={() => {
              getRank();
              getDB(query);
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <input
            className="graphLocationInput"
            type="datetime-local"
            defaultValue={moment(startDate).format("YYYY-MM-DDTHH:mm")}
            onChange={({ target }) => {
              setStartDate(moment(target.value).toISOString());
            }}
          />
          <p
            className="graphLocationInput-text"
            style={{ marginRight: "10px" }}
          >
            부터
          </p>
          <input
            className="graphLocationInput"
            type="datetime-local"
            defaultValue={moment(endDate).format("YYYY-MM-DDTHH:mm")}
            onChange={({ target }) => {
              setEndDate(moment(target.value).toISOString());
            }}
          />
          <p className="graphLocationInput-text">까지</p>
        </div>
      </div>
      <GraphComponents DB={DB} graphCount={graphCount} field="sound" />
      {/* <GraphComponents DB={DB} graphCount={graphCount} field="vibration" /> */}
      <div className="analyticsArea">
        <AnalyticsArcGraph
          value={soundPercent}
          reverse={false}
          title="소음비율"
        />
        <AnalyticsArcGraph value={soundRank} reverse={true} title="상위" />
        <div className="analyticsInfo"></div>
      </div>
      <DashboardTable DB={DB} />
    </div>
  );
};
