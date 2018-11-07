const chai = require('chai');
global.expect = chai.expect;
chai.should();

const assertArrays = require('chai-arrays');
chai.use(assertArrays);
