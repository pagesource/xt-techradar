const Ring = function (name, order) {
  const self = {};

  self.name = function () {
    return name;
  };

  self.order = function () {
    return order;
  };

  return self;
};

export default Ring;