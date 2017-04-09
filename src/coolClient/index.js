const {Lokka}     = require('lokka')
const {Transport} = require('lokka-transport-http')

const _graphqlEndpoint = process.env.GRAPHQL_ENDPOINT

if (_graphqlEndpoint === null || _graphqlEndpoint === undefined || _graphqlEndpoint === '') {
  throw new Error('GRAPHQL_ENDPOINT process variable must be defined');
}

const _client = new Lokka({
  transport: new Transport(_graphqlEndpoint)
});

module.exports = _client