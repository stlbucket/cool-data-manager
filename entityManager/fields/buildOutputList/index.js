const Promise = require('bluebird');

function buildOutputList(fields)
{
  return Promise.map(
    Object.keys(fields),
    fieldName => {
      return `${fieldName},`;
    }
  );
}

module.exports = buildOutputList;