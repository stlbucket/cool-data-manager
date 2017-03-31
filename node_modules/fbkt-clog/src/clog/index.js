"use strict";
const R      = require('ramda');
const util   = require('util');
const colors = require('colors');

const clogColors = [
  'green',
  'cyan',
];

let _curColor = 0;

module.exports = function (sectionIdentifier, logItem, color) {
  let useColor = color;

  if (R.isNil(useColor)) {
    _curColor = _curColor + 1 >= clogColors.length ? 0 : _curColor + 1;
    useColor  = clogColors[_curColor];
  }

  const cloptions = {
    sectionIdentifier: sectionIdentifier,
    logItem: logItem,
    prefix: '~~~~~~~~~~~~',
    suffix: '____________',
  };

  const thisColor = R.curry(colors[useColor]);

  const header  = thisColor(cloptions.prefix, cloptions.sectionIdentifier, cloptions.prefix);
  const message = typeof cloptions.logItem === 'string' ?
    thisColor(cloptions.logItem) :
    thisColor(util.inspect(cloptions.logItem, false, null));
  const footer  = thisColor(cloptions.suffix, 'END', cloptions.sectionIdentifier, cloptions.suffix);

  console.log(`
${header}
${message}
${footer}
`);
};