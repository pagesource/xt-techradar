const Quadrant = function (name) {
  let self, blips;

  self = {};
  blips = [];

  self.name = function () {
    return name.toLowerCase();
  };

  self.add = function (newBlips) {
    if (Array.isArray(newBlips)) {
      blips = blips.concat(newBlips);
    } else {
      blips.push(newBlips);
    }
  };

  self.blips = function () {
    return blips.slice(0);
  };

  return self;
};

export default  Quadrant;