const RingCalculator = function (numberOfRings, maxRadius) {
  const sequence = [0, 6, 6, 5, 5, 3, 2, 1];

  const self = {};

  self.sum = function(length) {
    return sequence.slice(0, length + 1).reduce(function (previous, current) {
      return previous + current;
    }, 0);
  };

  self.getRadius = function(ring) {
    const total = self.sum(numberOfRings);
    const sum = self.sum(ring);
    return maxRadius * sum / total;
  };

  return self;
};

export default RingCalculator;