const getProgressPercentage = (raised, target) => {
  return Math.min((raised / target) * 100, 100);
};

export default getProgressPercentage
