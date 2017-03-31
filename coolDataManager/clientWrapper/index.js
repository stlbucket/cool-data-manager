clog = require('fbkt-clog');

class ClientWrapper{
  constructor(client, options){
    this.client = client;
    this.options = options || {};
  }

  query(query, options){
    if (
      (options || {verbose: false}).verbose === true ||
      (this.options.verbose === true && (options || {verbose: false}).verbose !== false)
    ) {
      clog('EXECUTING GRAPH COOL QUERY', query);
    }
    return this.client.query(query);
  }

  mutate(mutation, options) {
    if (
      (options || { verbose: false }).verbose === true ||
      (this.options.verbose === true && (options || { verbose: false }).verbose !== false)
    ) {
      console.log('options', options);
      console.log('this.options', this.options);
      clog('EXECUTING GRAPH COOL MUTATION', mutation);
    }
    return this.client.mutate(mutation);
  }
}

module.exports = ClientWrapper;