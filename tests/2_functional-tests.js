const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('POST request to /api/solve', () => {
    test('Solve a puzzle with valid puzzle string', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: ''})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: '82ab4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: '824..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.728883'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST /api/check', () => {
    let puzzleString = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';

    test('Check placement with all fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'A1',
          value: 4,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isBoolean(res.body.valid);
          assert.isArray(res.body.conflict);
          done();
        });
    });

    test('Check placement with single placement conflict', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'A1',
          value: 1,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], 'column');
          done();
        });
    });

    test('Check placement with multiple placement conflicts', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'A3',
          value: 8,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], 'row');
          assert.equal(res.body.conflict[1], 'column');
          done();
        });
    });

    test('Check placement with all placement conflicts', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'E2',
          value: 6,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], 'row');
          assert.equal(res.body.conflict[1], 'column');
          assert.equal(res.body.conflict[2], 'region');
          done();
        });
    });

    test('Check placement with missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'E2',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check placement with invalid characters', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.&',
          coordinate: 'A5',
          value: 4
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check placement with missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: '.7.89.....1.5689..472...6.....3.1.2.8.6..47.1..2.9.387.6',
          coordinate: 'E2',
          value: 2
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Check placement with invalid placement coordinate', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'E!',
          value: 9,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check placement with invalid value', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleString,
          coordinate: 'E7',
          value: 'f',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  })
});

