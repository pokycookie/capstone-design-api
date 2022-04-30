import { useState } from "react";

export function PostDBComponents(props) {
  const [location, setLocation] = useState(100);
  const [sound, setSound] = useState(100);
  const [vibration, setVibration] = useState(100);

  return (
    <div className="postDBArea">
      <div className="nav">
        <button onClick={() => props.postData(location, sound, vibration)}>
          Update
        </button>
      </div>
      <div className="postDBList postDBTitle">
        <p className="postDBTitleElement">Location</p>
        <p className="postDBTitleElement">Sound</p>
        <p className="postDBTitleElement">Vibration</p>
      </div>
      <div className="postDBList">
        <input
          type="number"
          value={location || 100}
          onChange={(e) => setLocation(e.target.value)}
          className="postDBElement"
        />
        <input
          type="number"
          value={sound || 100}
          onChange={(e) => setSound(e.target.value)}
          className="postDBElement"
        />
        <input
          type="number"
          value={vibration || 100}
          onChange={(e) => setVibration(e.target.value)}
          className="postDBElement"
        />
      </div>
    </div>
  );
}
