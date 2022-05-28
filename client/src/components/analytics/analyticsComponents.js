import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { URI } from "../../App";
import { AnalyticsGraphArea } from "./anaylticsGraphArea";

export function AnalyticsComponents() {
  const [location, setLocation] = useState(101);
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, "h").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(1, "m").toISOString()
  );
  const [soundPercent, setSoundPercent] = useState();
  const [soundRank, setSoundRank] = useState();
  const [vibrationRank, setVibrationRank] = useState();

  //   useEffect(() => {
  //     console.log(soundPercent);
  //     console.log(soundRank);
  //     console.log(vibrationRank);
  //   }, [soundPercent, soundRank, vibrationRank]);

  const getDB = (params) => {
    axios
      .get(`${URI}/api/data`, { params })
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

  useEffect(() => {
    getDB(query);
    // eslint-disable-next-line
  }, [startDate, endDate, location]);

  const query = {
    $filter_updated: `$gte ${startDate} $lte ${endDate}`,
  };

  return (
    <div className="analyticsComponents">
      <div className="analyticsNav">
        <div className="analyticsNav-left">
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
        <div className="analyticsNav-right">
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
      <div className="analyticsMain">
        <div className="analyticsMain-rows">
          <AnalyticsGraphArea value={soundPercent} reverse={false} />
          <AnalyticsGraphArea value={soundRank} reverse={true} />
          <AnalyticsGraphArea value={vibrationRank} reverse={true} />
        </div>
      </div>
    </div>
  );
}
