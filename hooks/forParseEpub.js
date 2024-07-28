function convertArrayToObject(array) {
  return array.reduce((acc, curr) => {
    const key = Object.keys(curr)[0].replace(/[:]/g, "_");
    acc[key] = curr[Object.keys(curr)[0]];
    return acc;
  }, {});
}
module.exports = convertArrayToObject;
