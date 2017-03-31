const {Lokka}     = require('lokka')
const {Transport} = require('lokka-transport-http')

const client = new Lokka({
  transport: new Transport('https://api.graph.cool/simple/v1/cj0x5xot3uwqg0102dykzky2z')
})

module.exports = client