const noiseAttenuation = (location, source) => {
  const locationObj = {
    floor: parseInt(location / 100),
    number: location % 100,
  };
  const sourceObj = {
    floor: parseInt(source / 100),
    number: source % 100,
  };

  if (locationObj.floor === sourceObj.floor) {
  } else {
  }
};

module.exports = noiseAttenuation;
