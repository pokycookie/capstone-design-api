import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
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
  const [soundPercent, setSoundPercent] = useState();
  const [soundRank, setSoundRank] = useState();
  const [vibrationRank, setVibrationRank] = useState();

  const getRank = () => {
    axios
      .get(`${URI}/api/data`, {
        params: { $filter_updated: `$gte ${startDate} $lte ${endDate}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSoundPercent(
            parseInt(
              res.data
                .filter((e) => (e.location = location))
                .map((e) => (e.getSound / e.sound) * 100)
                .reduce((prev, curr) => {
                  return prev + curr;
                }, 0) / res.data.length
            )
          );
          setSoundRank(
            parseInt(
              res.data
                .filter((e) => (e.location = location))
                .map((e) => e.postSound)
                .reduce((prev, curr) => {
                  return prev + curr;
                }, 0) /
                res.data
                  .map((e) => e.postSound)
                  .reduce((prev, curr) => {
                    return prev + curr;
                  }, 0)
            )
          );
          setVibrationRank(
            parseInt(
              res.data
                .filter((e) => (e.location = location))
                .map((e) => e.vibration)
                .reduce((prev, curr) => {
                  return prev + curr;
                }, 0) /
                res.data
                  .map((e) => e.vibration)
                  .reduce((prev, curr) => {
                    return prev + curr;
                  }, 0)
            )
          );
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
  }, [startDate, endDate, location]);

  return (
    <div className="dashboardComponents">
      <div className="dashboardNav">
        <div className="dashboardNav-left">
          <button
            className="graphBtn refreshBtn"
            onClick={() => {
              getDB(query);
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
          <input
            className="graphLocationInput"
            type="datetime-local"
            defaultValue={moment(startDate).format("YYYY-MM-DDTHH:mm")}
            onChange={({ target }) => {
              setStartDate(moment(target.value).toISOString());
            }}
          />
          <p className="graphLocationInput-text">부터</p>
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
        <AnalyticsArcGraph value={soundPercent} reverse={false} />
        <AnalyticsArcGraph value={soundRank} reverse={true} />
        <div className="analyticsInfo"></div>
      </div>
      <DashboardTable DB={DB} />
    </div>
  );
};
