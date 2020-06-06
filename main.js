'use strict';

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Checker{
  constructor(color){
    if(color == "white"){
      this.symbol = String.fromCharCode(0x125CB)
    }
    else{
      this.symbol = String.fromCharCode(0x125CF)
    }
  }
}







class Board {
  constructor() {
    this.grid = [];
    this.checkers = [];
  }

  // method that creates an 8x8 array, filled with null values
  createGrid() {
    // loop to create the 8 rows
    for (let row = 0; row < 8; row++) {
      this.grid[row] = [];
      // push in 8 columns of nulls
      for (let column = 0; column < 8; column++) {
        this.grid[row].push(null);
      }
    }
  }
  viewGrid() {
    // add our column numbers
    let string = "  0 1 2 3 4 5 6 7\n";
    for (let row = 0; row < 8; row++) {
      // we start with our row number in our array
      const rowOfCheckers = [row];
      // a loop within a loop
      for (let column = 0; column < 8; column++) {
        // if the location is "truthy" (contains a checker piece, in this case)
        if (this.grid[row][column]) {
          // push the symbol of the check in that location into the array
          rowOfCheckers.push(this.grid[row][column].symbol);
        } else {
          // just push in a blank space
          rowOfCheckers.push(' ');
        }
      }
      // join the rowOfCheckers array to a string, separated by a space
      string += rowOfCheckers.join(' ');
      // add a 'new line'
      string += "\n";
    }
    console.log(string);
  }

  //creating checkers
  createWhitePiece(){
    let whitePositions = [[0, 1], [0, 3], [0, 5], [0, 7],
    [1, 0], [1, 2], [1, 4], [1, 6],
    [2, 1], [2, 3], [2, 5], [2, 7]];
    let whiteChecker = new Checker("white");
    for(let i=0; i <whitePositions.length; i++){
      this.grid[whitePositions[i][0]][whitePositions[i][1]] = whiteChecker;
      this.checkers.push(whiteChecker);
    }
  }
  createBlackPiece(){
    let blackPositions = [[5, 0], [5, 2], [5, 4], [5, 6],
    [6, 1], [6, 3], [6, 5], [6, 7],
    [7, 0], [7, 2], [7, 4], [7, 6]];
    let blackChecker = new Checker("black");
    for(let i=0; i <blackPositions.length; i++){
      this.grid[blackPositions[i][0]][blackPositions[i][1]] = blackChecker;
      this.checkers.push(blackChecker);
    }
  }
  selectChecker(row, column){
    console.log(this.grid[row][column]);
    return this.grid[row][column];
  }
  killChecker(position) {
    this.checkers.splice(position, 1)
    // this.board.grid.position = null;
    // let position = [row,column];
    // this.selectChecker(position) = indexOf()
  }
}

class Game {
  constructor() {
    this.board = new Board;
  }
  start() {
    this.board.createGrid();
    this.board.createWhitePiece();
    this.board.createBlackPiece();
  }
  moveChecker(whichPiece, toWhere){
    let startingRow = parseInt(whichPiece[0]);
    let startingColumn= parseInt(whichPiece[1]);
    let endingRow = parseInt(toWhere[0]);
    let endingColumn = parseInt(toWhere[1]);
    let checker = this.board.selectChecker([startingRow], [startingColumn]);
    this.board.grid[endingRow][endingColumn] = checker;
    this.board.grid[startingRow][startingColumn] = null;
    if (Math.abs(whichPiece[0] - toWhere[0]) == 2) {
      const midPointRow = (parseInt(whichPiece[0]) + parseInt(toWhere[0])) / 2;
      console.log(midPointRow + "test one")
      const midPointColumn = (parseInt(whichPiece[1]) + parseInt(toWhere[1])) / 2;
      console.log(midPointColumn + "test two")
      let killPosition = this.board.selectChecker(midPointRow, midPointColumn);
      this.board.killChecker(killPosition);
      this.board.grid[midPointRow][midPointColumn] = null;
    }
  }
}



function getPrompt() {
  game.board.viewGrid();
  rl.question('which piece?: ', (whichPiece) => {
    rl.question('to where?: ', (toWhere) => {
      game.moveChecker(whichPiece, toWhere);
      getPrompt();
    });
  });
}

const game = new Game();
game.start();


// Tests
if (typeof describe === 'function') {
  describe('Game', () => {
    it('should have a board', () => {
      assert.equal(game.board.constructor.name, 'Board');
    });
    it('board should have 24 checkers', () => {
      assert.equal(game.board.checkers.length, 24);
    });
  });

  describe('Game.moveChecker()', () => {
    it('should move a checker', () => {
      assert(!game.board.grid[4][1]);
      game.moveChecker('50', '41');
      assert(game.board.grid[4][1]);
      game.moveChecker('21', '30');
      assert(game.board.grid[3][0]);
      game.moveChecker('52', '43');
      assert(game.board.grid[4][3]);
    });
    it('should be able to jump over and kill another checker', () => {
      game.moveChecker('30', '52');
      assert(game.board.grid[5][2]);
      assert(!game.board.grid[4][1]);
      assert.equal(game.board.checkers.length, 23);
    });
  });
} else {
  getPrompt();
}
