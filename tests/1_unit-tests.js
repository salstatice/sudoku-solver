const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  suite('Logic Handlers', () => {
    
    test('A valid puzzle string of 81 characters', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.isTrue(solver.validate(puzzleString), 'PuzzleString have 81 valid characters');
      done();
    });

    test('Puzzle string with invalid characters (not 1-9 or .)', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5..abc9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.isFalse(solver.validate(puzzleString), 'return False when PuzzleString have invalid characters');
      done();
    });

    test('Puzzle string that is not 81 characters in length', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.isFalse(solver.validate(puzzleString), 'return False when PuzzleString is not 81 characters in length');
      done();
    });

    test('Valid row placement', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let row = 0;
      let column = 5;
      let value = 3;
      assert.isTrue(solver.checkRowPlacement(puzzleString, row, column, value), 'return True when row placement is valid');
      done();
    });

    test('Invalid row placement', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let row = 0;
      let column = 5;
      let value = 8;
      assert.isFalse(solver.checkRowPlacement(puzzleString, row, column, value), 'return False when row placement is invalid');
      done();
    });

    test('Valid column placement', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let row = 0;
      let column = 1;
      let value = 4;
      assert.isTrue(solver.checkColPlacement(puzzleString, row, column, value), 'return True when column placement is valid');
      done();
    });

    test('Invalid column placement', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let row = 0;
      let column = 1;
      let value = 7;
      assert.isFalse(solver.checkColPlacement(puzzleString, row, column, value), 'return False when column placement is invalid');
      done();
    });

    test('Valid region (3x3 grid) placement', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let row = 4;
      let column = 1;
      let value = 4;
      assert.isTrue(solver.checkRegionPlacement(puzzleString, row, column, value), 'return True when region placement is valid');
      done();
    });

    test('Invalid region (3x3 grid) placement', function(done) {
      let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let row = 4;
      let column = 1;
      let value = 8;
      assert.isFalse(solver.checkRegionPlacement(puzzleString, row, column, value), 'return False when region placement is invalid');
      done();
    });
  });

  suite('Solver', () => {
    test('Valid puzzle strings pass the solver', function(done) {
      let puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      assert.isOk(solver.solver(puzzleString), 'Return solution String');
      done();
    });

    test('Invalid puzzle strings fail the solver', function(done) {
      let puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.728883';
      assert.isNotOk(solver.solver(puzzleString), 'Invalid puzzle strings return False');
      done();
    });

    test('Solver returns the the expected solution', function(done) {
      let puzzleString = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
      let expect = '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
      assert.equal(solver.solver(puzzleString), expect, 'Solver returns the the expected solution');
      done();
    });
  });
});
