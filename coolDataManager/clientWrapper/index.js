clog = require('fbkt-clog');

class ClientWrapper{
  constructor(client, options){
    this.client = client;
    this.options = options || {};
  }

  query(query){
    if (this.options.verbose === true) {
      clog('EXECUTING GRAPH COOL QUERY', query);
    }
    return this.client.query(query);
  }

  mutate(mutation) {
    if (this.options.verbose === true) {
      clog('EXECUTING GRAPH COOL MUTATION', mutation);
    }
    return this.client.mutate(mutation);
  }
}

module.exports = ClientWrapper;