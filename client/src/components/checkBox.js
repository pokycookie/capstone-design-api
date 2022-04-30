const { useState, useEffect } = require("react");

export function CheckBox(props) {
  const [isCheck, setCheck] = useState(false);

  useEffect(() => {
    setCheck(props.isAllCheck);
  }, [props.isAllCheck]);

  useEffect(() => {
    if (props.refreshFlag === true) {
      setCheck(false);
    }
    props.setRefreshFlag(false);
  }, [props]);

  return (
    <input
      type="checkbox"
      checked={isCheck}
      onChange={({ target }) => {
        setCheck(target.checked);
        if (target.checked) {
          props.checkSet.add(props.element._id);
          props.setCheckSet(props.checkSet);
        } else {
          props.checkSet.delete(props.element._id);
          props.setCheckSet(props.checkSet);
        }
        console.log(props.checkSet);
      }}
    />
  );
}
