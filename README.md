# cool-data-manager
manage entities on graph.cool

```
npm i -S cool-data-manager
```

# graph.cool schema
```
type YetAnotherThing {
  createdAt: DateTime!
  id: ID!
  stringData: String
  thing: Thing @relation(name: "MoreThingsOnThing")
  updatedAt: DateTime!
}

type OtherThing {
  createdAt: DateTime!
  id: ID!
  stringData: String
  thing: Thing @relation(name: "OtherThingOnThing")
  updatedAt: DateTime!
}

type Thing {
  booleanData: Boolean
  createdAt: DateTime!
  dateTimeData: DateTime
  enumData: THING_ENUM_DATA
  floatData: Float
  id: ID!
  intData: Int
  jsonData: Json
  otherThing: OtherThing @relation(name: "OtherThingOnThing")
  stringData: String
  stringRequired: String!
  updatedAt: DateTime!
  yetAnotherThings: [YetAnotherThing!]! @relation(name: "MoreThingsOnThing")
}
```

# Lokka Client
```
const {Lokka}     = require('lokka')
const {Transport} = require('lokka-transport-http')

const client = new Lokka({
  transport: new Transport('https://api.graph.cool/simple/v1/[SIMPLE_API_KEY]')
})

module.exports = client
```

# CoolDataManager - Thing, OtherThing and YetAnotherThing 
```
const CoolDataManager = require('cool-data-manager').CoolDataManager;
const CoolRelation = require('cool-data-manager').CoolRelation;
const CoolCollection = require('cool-data-manager').CoolCollection;

const client = require('../client');

const OtherThing = require('../otherThing');
const YetAnotherThing = require('../yetAnotherThing');

const entityInfo = {
  entityName: 'Thing',
  entityNamePlural: 'Things',
  fields: {
    stringRequired: {
      type: 'string',
      required: true
    },
    stringData: {
      type: 'string'
    },
    intData: {
      type: 'int'
    },
    enumData: {
      type: 'enum',
      validValues: [ 'One', 'Two' ]
    },
    floatData: {
      type: 'float'
    },
    booleanData: {
      type: 'boolean'
    },
    dateTimeData: {
      type: 'dateTime'
    },
    otherThing: {
      type: new CoolRelation(OtherThing)
    },
    yetAnotherThings: {
      type: new CoolCollection(YetAnotherThing)
    }
  }
};

const entityManager = new CoolDataManager(entityInfo, client, { verbose: false });

module.exports = entityManager;
```

# Test it out
```
'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');

describe.only(__filename, function () {
  it('should create one thing and delete it', function (done) {
    this.timeout(10000);
    const testId     = uuid.v4();
    const testEntity = {
      stringRequired: testId,
      stringData: testId,
      intData: 1,
      enumData: 'One',
      floatData: 1.2345,
      booleanData: true,
      dateTimeData: moment.utc().format(),
      otherThing: {
        stringData: 'OTHER THING DATA'
      },
      yetAnotherThings: [
        {
          stringData: 'YET MORE'
        },
        {
          stringData: 'Still Yet MOre evEN'
        }
      ]
    };

    entityManager.createOne(testEntity, {
      verbose: true
    })
      .then(thing => {
        clog('THING', thing);
        expect(thing).to.be.an('object');
        expect(thing.stringData).to.equal(testEntity.stringData);
        expect(thing.intData).to.equal(testEntity.intData);
        expect(thing.enumData).to.equal(testEntity.enumData);
        expect(thing.floatData).to.equal(testEntity.floatData);
        expect(thing.booleanData).to.equal(testEntity.booleanData);
        expect(moment.utc(thing.dateTimeData).format()).to.equal(testEntity.dateTimeData);
        expect(thing.otherThing).to.be.an('object');
        expect(thing.otherThing.stringData).to.equal(testEntity.otherThing.stringData);
        expect(thing.yetAnotherThings).to.be.an('array');
        expect(thing.yetAnotherThings.length).to.equal(testEntity.yetAnotherThings.length);
        expect(thing.yetAnotherThings[0]).to.be.an('object');
        expect(thing.yetAnotherThings[0].stringData).to.equal(testEntity.yetAnotherThings[0].stringData);
        expect(thing.yetAnotherThings[1].stringData).to.equal(testEntity.yetAnotherThings[1].stringData);

        return entityManager.deleteOne(thing)
          .then(result => {
            expect(result).to.be.an('object');
            expect(result.id).to.equal(thing.id);
            // clog('DELETE ONE RESULT', result);
            done();
          })
      })
      .catch(error => {
        done(error);
      })
  });
});
```

```
~~~~~~~~~~~~ EXECUTING GRAPH COOL MUTATION ~~~~~~~~~~~~
{
  createThing(
    stringRequired: "737634ab-8f4d-4595-bf02-13a411f67a02",
    stringData: "737634ab-8f4d-4595-bf02-13a411f67a02",
    intData: 1,
    enumData: One,
    floatData: 1.2345,
    booleanData: true,
    dateTimeData: "2017-04-01T02:21:07Z",
    otherThing: {
    stringData: "OTHER THING DATA",
    },
      yetAnotherThings: [
        {

    stringData: "YET MORE",
        },{

    stringData: "Still Yet MOre evEN",
        }
      ],

  ) {
    id,
    createdAt,
    updatedAt,
       stringRequired,
         stringData,
         intData,
         enumData,
         floatData,
         booleanData,
         dateTimeData,
      otherThing {
                 stringData,

            },
            yetAnotherThings {
                 stringData,

            },

  },
}
____________ END EXECUTING GRAPH COOL MUTATION ____________


~~~~~~~~~~~~ THING ~~~~~~~~~~~~
{ updatedAt: '2017-04-01T02:21:08.000Z',
  enumData: 'One',
  booleanData: true,
  dateTimeData: '2017-04-01T02:21:07.000Z',
  yetAnotherThings:
   [ { stringData: 'YET MORE' },
     { stringData: 'Still Yet MOre evEN' } ],
  floatData: 1.2345,
  id: 'cj0ymsx4erc2l01853i8nd3xv',
  intData: 1,
  otherThing: { stringData: 'OTHER THING DATA' },
  createdAt: '2017-04-01T02:21:08.000Z',
  stringRequired: '737634ab-8f4d-4595-bf02-13a411f67a02',
  stringData: '737634ab-8f4d-4595-bf02-13a411f67a02' }
____________ END THING ____________

    ✓ should create one thing and delete it (1466ms)
```
... it can already do quite a bit more, with a few more features before it's done.  check out the <a href="https://github.com/stlbucket/cool-data-manager/tree/master/test/thing">thing tests</a>
