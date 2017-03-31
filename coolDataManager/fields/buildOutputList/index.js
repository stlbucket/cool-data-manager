const Promise = require('bluebird');

function buildOutputList(fields)
{
  const fieldsArray = fields instanceof Array ? fields : Object.keys(fields);

  return Promise.reduce(
    fieldsArray,
    (acc, fieldName) => {
      return acc.concat(`   ${fieldName},
      `);
    },
    ''
  );
}

module.exports = buildOutputList;