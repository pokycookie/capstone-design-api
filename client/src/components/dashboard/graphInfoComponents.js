import { ArcGraphComponents } from "./arcGraphComponents";

export function GraphInfoComponents({ offset, width, average, focusData }) {
  return (
    <div className="graphInfoComponents" style={{ width }}>
      <div className="graphInfo-title"></div>
      <ArcGraphComponents
        offset={offset}
        average={average}
        focusData={focusData}
      />
    </div>
  );
}
