import { ArcGraphComponents } from "./arcGraphComponents";

export function GraphInfoComponents({ offset, field, width, DB, average }) {
  return (
    <div className="graphInfoComponents" style={{ width }}>
      <div className="graphInfo-title">
        <p>{`${field} dashboard`}</p>
      </div>
      <ArcGraphComponents
        offset={offset}
        DB={DB}
        field={field}
        average={average}
      />
    </div>
  );
}
