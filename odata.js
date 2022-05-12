const odata = (query) => {
  if (typeof query !== "object") return;

  const result = {};
  const filter = {};
  const orderby = {};

  // filter
  if (query.hasOwnProperty("$filter_location")) {
    filter.location = splitQuery(query.$filter_location);
  }
  if (query.hasOwnProperty("$filter_sound")) {
    filter.sound = splitQuery(query.$filter_sound);
  }
  if (query.hasOwnProperty("$filter_vibration")) {
    filter.vibration = splitQuery(query.$filter_vibration);
  }
  if (query.hasOwnProperty("$filter_updated")) {
    filter.updated = splitQuery(query.$filter_updated, "string");
  }

  // orderby
  if (query.hasOwnProperty("$orderby_location")) {
    orderby.location = query.$orderby_location;
  }
  if (query.hasOwnProperty("$orderby_sound")) {
    orderby.sound = query.$orderby_sound;
  }
  if (query.hasOwnProperty("$orderby_vibration")) {
    orderby.vibration = query.$orderby_vibration;
  }
  if (query.hasOwnProperty("$orderby_updated")) {
    orderby.updated = query.$orderby_updated;
  }

  result.filter = filter;
  result.orderby = orderby;

  return result;
};

const splitQuery = (string, type) => {
  if (typeof string !== "string") return;

  let equals = false;
  const result = {};
  const stringArr = string.split(" ");

  stringArr.forEach((element, index) => {
    if (index % 2 === 0) {
      if (type === "string") {
        result[element] = stringArr[index + 1];
      } else {
        result[element] = parseFloat(stringArr[index + 1]);
      }
    }
    if (element === "$equals") {
      equals =
        type === "string"
          ? stringArr[index + 1]
          : parseFloat(stringArr[index + 1]);
    }
  });

  if (equals === false) {
    return result;
  } else {
    return equals;
  }
};

module.exports = odata;
