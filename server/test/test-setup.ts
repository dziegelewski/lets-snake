import chai from 'chai'
import assertArrays from 'chai-arrays';

declare var global: any

global.expect = chai.expect;
chai.should();
chai.use(assertArrays);

