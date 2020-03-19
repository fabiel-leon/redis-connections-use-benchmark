require('dotenv').config();
const { series } = require('async');

const testdata = {
  property: 'value',
};

const openCloseConn = require('./openAndCloseConn')(testdata);
const reuseConn = require('./reuseConn')(testdata);
const connPool = require('./connPool')(testdata);
const concurrentOpenCloseConn = require('./concurrentOpenAndCloseConn')(testdata);
const concurrentReuseConn = require('./concurrentReuseConn')(testdata);
const concurrentConnPool = require('./concurrentConnPool')(testdata);


const fillData = (done) => {
  for (let index = 0; index < 30; index += 1) {
    testdata[`property${index}`] = `value${index}`;
  }
  testdata.sub = { ...testdata };

  console.log('testdate', JSON.stringify(testdata));
  done(null, testdata);
};


series([
  fillData,
  openCloseConn,
  connPool,
  reuseConn,
  concurrentOpenCloseConn,
  concurrentConnPool,
  concurrentReuseConn,
], (err, data) => {
  console.log('\n\n');
});
