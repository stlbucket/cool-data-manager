const clog = require('../clog');

module.exports = function (sectionIdentifier, logItem) {
  return clog(sectionIdentifier, logItem, 'red')
}