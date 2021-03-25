class SudokuSolver {

  validate(puzzleString) {
    let result = (puzzleString.length == 81);
    let result2 = /^[1-9\.]+$/.test(puzzleString);
    return (result && result2);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let puzzle = puzzleString;
    let puzzleArray = [];
    for (let n=0; n<81; n+=9) {
      puzzleArray.push(puzzle.slice(n, n+9))
    }
    let result = !puzzleArray[row].includes(value.toString());
    return result;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let puzzle = puzzleString;
    let puzzleArray = [];
    let n = column;
    while (n < 81) {
      puzzleArray.push(puzzle[n]);
      n+=9;
    } 
    let result = !puzzleArray.includes(value.toString());
    return result;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let puzzle = puzzleString;
    let puzzleArray = [];
    let regionArray = [];
    
    for (let i = 0; i < 81; i+=9) {
      let rowArray = [];
      for (let j = i; j < (i + 9) ; j++) {
        rowArray.push(puzzle[j]);
      }
      puzzleArray.push(rowArray);
    }
    
    // group 0 = row/column 0,1,2 ; 
    // group 3 = row/column 3,4,5 ; 
    // group 6 = row/column 6,7,8 ;
    let rGroup = Math.floor(row / 3) * 3;
    let cGroup = Math.floor(column / 3) * 3;
    
    for (let i = rGroup; i < (rGroup + 3) ; i++) {
      for (let j = cGroup; j < (cGroup + 3); j++) {
        regionArray.push(puzzleArray[i][j])
      }
    }
     
    let result = !regionArray.join('').includes(value)
    return result;  
  }

  isPlacementPossible(puzzleString, position, value) {
    let row = Math.floor(position / 9);
    let column = position  % 9;
    if (!this.checkRowPlacement(puzzleString, row, column, value)) return false;
    if (!this.checkColPlacement(puzzleString, row, column, value)) return false;
    if (!this.checkRegionPlacement(puzzleString, row, column, value)) return false;

    return true;
  }

  convertToPosition(coordinate) {
    if (coordinate.length != 2) return false;
    let array = coordinate.split('');

    if (isNaN(array[1])) return false;

    if (array[0].toUpperCase().charCodeAt(0) < 65 || array[0].toUpperCase().charCodeAt(0) > 73) return false;
    
    let row = array[0].toUpperCase().charCodeAt(0) - 65;
    let column = array[1] - 1;
    let position = [row, column];
    return position
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)){
      return false;
    }
    let index = puzzleString.indexOf('.');
  
    if (index == -1) {
      return puzzleString;
    }
    
    for (let n = 1; n <=9; n++) {
      if (this.isPlacementPossible(puzzleString, index, n)) {
        let puzzleArray = puzzleString.split('');
        puzzleArray[index] = n;
        puzzleString = puzzleArray.join('');
        puzzleString = this.solve(puzzleString);
      } 
    }
    
    if (puzzleString.indexOf('.') != -1) {
      let puzzleArray = puzzleString.split('');
      puzzleArray[index] = '.';
      puzzleString = puzzleArray.join('');
    }
    
    return puzzleString;
  }

  solver(puzzleString) {
    let input = puzzleString;
    let output = this.solve(puzzleString);

    if (input == output) return false;
    return output
  }
}

module.exports = SudokuSolver;

