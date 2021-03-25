'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzleString = (req.body.puzzle ? req.body.puzzle : null);
      let coordinate = req.body.coordinate;
      let value = req.body.value;

      let position; // is an Array; [row, column]
      let result;

      // validate input
      if (!puzzleString || !coordinate || !value) {
        res.json({ error: 'Required field(s) missing' });
      } else if (puzzleString.length != 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      } else if (!solver.validate(puzzleString)) {
        res.json({ error: 'Invalid characters in puzzle' });
      } else if (isNaN(value) || value < 1 || value > 9) {
        res.json({ error: 'Invalid value' })
      } else if (!solver.convertToPosition(coordinate)) {
        res.json({ error: 'Invalid coordinate' })
      } else {
        position = solver.convertToPosition(coordinate)

        let row = position[0];
        let column = position[1];
        let valid = true;
        let conflict = [];

        if (!solver.checkRowPlacement(puzzleString, row, column, value)) {
          valid = false;
          conflict.push("row");
        }
        if (!solver.checkColPlacement(puzzleString, row, column, value)) {
          valid = false;
          conflict.push("column");
        }
        if (!solver.checkRegionPlacement(puzzleString, row, column, value)) {
          valid = false;
          conflict.push("region");
        }

        result = {
          valid: valid,
          conflict: conflict,
        }
      }

      res.json(result);
    });

  app.route('/api/solve')
    .post((req, res) => {

      let puzzleString = req.body.puzzle;
      if (!puzzleString) {
        res.json({ error: 'Required field missing' });
      } else if (puzzleString.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      } else if (!solver.validate(puzzleString)) {
        res.json({ error: 'Invalid characters in puzzle' });
      } else if (!solver.solver(puzzleString)) {
        res.json({ error: 'Puzzle cannot be solved' });
      } else {
        res.json({
          solution: solver.solver(puzzleString)
        });
      }

    });
};
