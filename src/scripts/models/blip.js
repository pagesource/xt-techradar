const IDEAL_BLIP_WIDTH = 22;
const Blip = function (name, ring, filename, topic, description, tags) {
  var self, number;

  self = {};
  number = -1;

  self.width = IDEAL_BLIP_WIDTH;

  self.name = function () {
    return name;
  };

  self.topic = function () {
    return topic || '';
  };

  self.description = function () {
    return description || '';
  };

  self.filename = function () {
    return filename;
  };

  self.ring = function () {
    return ring;
  };

  self.number = function () {
    return number;
  };

  self.setNumber = function (newNumber) {
    number = newNumber;
  };

  self.tags = function() {
    return tags || [];
  }

  return self;
};

module.exports = Blip;
