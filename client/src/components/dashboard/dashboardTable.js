import moment from "moment";
import { useWindow } from "../../hooks";

export function DashboardTable({ DB }) {
  const windowSize = useWindow();

  return (
    <div className="dashboardTableArea">
      <div className="dashboardTable-title">
        <p>sound</p>
        <p>낸 소음</p>
        <p>받은 소음</p>
        <p>소음 비율</p>
        <p>updated</p>
      </div>
      <ul
        className="dashboardTable-ul"
        style={{ height: windowSize.height - 170 }}
      >
        {Array.isArray(DB)
          ? DB.map((element, index) => {
              const postSound = element.postSound < 0 ? 0 : element.postSound;
              const getSound = element.sound - postSound;
              return (
                <li className="dashboardTable-li" key={index}>
                  <p>{element.sound}</p>
                  <p>{postSound}</p>
                  <p>{getSound}</p>
                  <div className="dashboardTable-ratioBar">
                    <div
                      className="dashboardTable-ratioBar-div postSound"
                      style={{ flex: (postSound / element.sound) * 100 }}
                    >
                      {((postSound / element.sound) * 100).toFixed(1)}%
                    </div>
                    <div
                      className="dashboardTable-ratioBar-div getSound"
                      style={{ flex: (getSound / element.sound) * 100 }}
                    >
                      {((getSound / element.sound) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <p>{moment(element.updated).format("YYYY-MM-DD HH:mm")}</p>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}
