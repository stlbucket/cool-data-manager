const coolClient = require('../../coolClient');

clog = require('fbkt-clog');

class ClientWrapper{
  constructor(options){
    this.options = options || {};
  }

  query(query, options){
    if (
      (options || {verbose: false}).verbose === true ||
      (this.options.verbose === true && (options || {verbose: false}).verbose !== false)
    ) {
      clog('EXECUTING GRAPH COOL QUERY', query);
    }
    return coolClient.query(query);
  }

  mutate(mutation, options) {
    if (
      (options || { verbose: false }).verbose === true ||
      (this.options.verbose === true && (options || { verbose: false }).verbose !== false)
    ) {
      clog('EXECUTING GRAPH COOL MUTATION', mutation);
    }
    return coolClient.mutate(mutation);
  }
}

module.exports = ClientWrapper;