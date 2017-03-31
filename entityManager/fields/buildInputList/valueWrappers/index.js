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

module.exports = valueWrappers;