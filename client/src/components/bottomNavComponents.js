export function BottomNavComponents(props) {
  return (
    <div className="bottomNav">
      <p>{new Date().toString()}</p>
      <p>2022 PKNU CAPSTONE DESIGN PROJECT WEBPAGE</p>
      <div>{props.login === false ? "SIGN IN" : props.login.nickname}</div>
    </div>
  );
}
