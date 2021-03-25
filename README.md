# [Sudoku Solver](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver)

### About the project

This project is an assignment project created by FCC for Quality Assurance Certification.

This Sudoku Solver has two main functions:

1. check if a number has any vertical, horizonal or regional conflict at a given position
2. solve a given sudoku puzzle string

Puzzle string are expected to be 81 characters long. Blank spaces are represented by a period `.`. Puzzle string can only have number **1 to 9** and  `.`

### Getting Started

[Express](https://expressjs.com/) is used as the Node.js web application framework in this project. See [hello-world example](https://expressjs.com/en/starter/hello-world.html).

#### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). To install Node, go to https://nodejs.org and select the appropriate installation package depending on your computer's platform (Windows, MacOS or Linux).

`Note: On Windows machines, you may need to configure your PATH environmental variable in case you forgot to turn on the add to PATH during the installation steps.`

#### Verifying the Node Installation
To ensure that your NodeJS setup is working correctly, open the terminal and type the following to check for the version of Node and NPM
```
$ node -v
$ npm -v
```

#### Installing project dependencies
This project uses NPM to manage software dependencies. NPM Relies on the package.json file. To install dependencies, open the terminal, cd to the project directory and run:
```
$ npm install
```

### Running the server
To run locally, cd to the project directory and type the following command:
```
$ node server.js
```
Then, load http://localhost:3000/ in a browser to see the output.

### Routes

This project has two API routes, one for checking placement and one for solving puzzle.

#### POST /api/check

This API endpoint checks if a number is valid at a given position for a sudoku puzzle. The endpoint expects a **sudoku puzzle string**, a **coordination** in (letter-number) format and a **number value** between 1 to 9. It returns if the number is valid for the position and the type of conflict the number had if it is not valid.

Sample request:
```js
{
    puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
    coordinate: 'A1',
     value: 4,
}
```

Sample return:
```js
{ "valid": true, "conflict": [] }

{ "valid": false, "conflict": [ "row", "column", "region" ] }
```

Sample error:
```js
{ "error": "Invalid characters in puzzle" }
{ "error": "Expected puzzle to be 81 characters long" }
{ "error": "Invalid coordinate" }
{ "error": "Invalid value" }
{ "error": "Required field(s) missing" }
```

#### POST /api/solve

This API endpoint solves a given sudoku puzzle string. It expects a valid puzzle string.

Sample request:
```js
{puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'}
```

Sample return:
```js
{ "solution": '827549163531672894649831527496157382218396475753284916962415738185763249374928651' }
```

Sample error:
```js
{ "error": "Required field missing" }
{ "error": "Invalid characters in puzzle" }
{ "error": "Expected puzzle to be 81 characters long" }
{ "error": "Puzzle cannot be solved" }
```

### Solver logic

This project use backtracking to search for solution. The solver logic for this project are located in the directory at `/controllers/sudoku-solver.js`

### Testing

Unittests and functional testes are located in the `/tests` folder. 

To run test, set up the following environment variable, or put the following variable in a `.env` file:
```
NODE_ENV=test
```

Then, run the app with the following command:
```
$ node server.js
```