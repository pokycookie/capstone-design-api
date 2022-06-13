const noiseAttenuation = (location, source) => {
  if (!(typeof location === "number" && typeof source === "number")) {
    return 0.5;
  }

  const locationObj = {
    floor: parseInt(location / 100),
    number: location % 100,
  };
  const sourceObj = {
    floor: parseInt(source / 100),
    number: source % 100,
  };

  const vertical = Math.abs(locationObj.floor - sourceObj.floor);
  const horizontal = Math.abs(locationObj.number - sourceObj.number);

  return Math.pow(0.5, Math.max(vertical, horizontal));
};

module.exports = noiseAttenuation;
