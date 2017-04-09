const clog = require('fbkt-clog');
const fetch              = require('node-fetch');
const introspectionQuery = require('graphql/utilities/introspectionQuery').introspectionQuery;
const _graphqlEndpoint = process.env.GRAPHQL_ENDPOINT

if (_graphqlEndpoint === null || _graphqlEndpoint === undefined || _graphqlEndpoint === '') {
  throw new Error('GRAPHQL_ENDPOINT process variable must be defined');
}

async function initializeSchema(options) {
  clog('INITIALIZING SCHEMA', _graphqlEndpoint);
  clog('INITIALIZING SCHEMA', options);

  const response = await fetch(_graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query: introspectionQuery}),
  });

  const {data, errors} = await response.json();

  if (errors) {
    throw new Error(JSON.stringify(errors, null, 2))
  }

  // clog('DATA', data);

  return data.__schema.types.filter(type => options.useEntities.indexOf(type.name) > -1);
}

module.exports = initializeSchema;