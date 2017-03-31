const clog = require('fbkt-clog');

const valueWrappers = {
  string: (value) => {
    return value ? `"${value}"` : `""`;
  },
  int: (value) => {
    value = value || null;
    return `${value}`;
  },
  enum: (value) => {
    return `${value}`;
  },
  float: (value) => {
    return `${value}` || null;
  },
  boolean: (value) => {
    return `${value}`;
  },
  dateTime: (value) => {
    return `"${value}"` || null;
  },
  json: (value) => {
    throw new Error('JSON fields not yet supported:  check with graph.cool')
    // return `${JSON.stringify(value)}`;
  },
};

const fieldList = {
  in: (fields, entity) => {
    return Object.keys(fields).reduce(
      (acc, fieldName) => {
        if ((entity[fieldName] === undefined || entity[fieldName] === null) && fields[fieldName].required === true) {
          throw new Error (`Missing Required Field: ${fieldName}`);
        }

        if (entity[fieldName] !== undefined){
          const type = fields[fieldName].type;
          const value = valueWrappers[type](entity[fieldName]);
          return acc.concat(`${fieldName}: ${value},
        `);
        } else {
          return acc;
        }
      },
      ''
    );
  },
  // in: (fields, entity) => {
  //   return Object.keys(fields).map(
  //     fieldName => {
  //       const type  = fields[fieldName].type;
  //       const value = valueWrappers[type](entity[fieldName]);
  //
  //       return `${fieldName}: ${value}`;
  //     }
  //   );
  // },
  out: (fields) => {
    return Object.keys(fields).map(
      fieldName => {
        return `${fieldName},`;
      }
    );
  }
}


module.exports = fieldList;
