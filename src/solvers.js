/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

// window.findSolutions = (row, n, board, validate, callback) => {
//   if (row === n) {
//     callback();
//     return;
//   }

//   for (let i = 0; i < n; i++) {
//     board.togglePiece(row, i);
//     if (!board[validate]()) {
//       findSolution(row + 1, n, board, validate, callback);
//     }
//     board.togglePiece(row, i);
//   }
// };

window.findNRooksSolution = function(n) {
  var temp = new Board({n: n});
  let solution = [];
  let rowIndex = 0;
  let colIndex = 0;
  let count = 0;
  let recursive = (gameBoard, rowIndex, colIndex) => {
    gameBoard[rowIndex][colIndex] = 1;
    count++;
    if (temp.hasAnyRowConflicts()) {
      gameBoard[rowIndex][colIndex] = 0;
      count--;
      recursive(gameBoard, rowIndex + 1, colIndex);
    }
    if (temp.hasAnyColConflicts()) {
      gameBoard[rowIndex][colIndex] = 0;
      count--;
      recursive(gameBoard, rowIndex, colIndex + 1);
    }
    if (count !== n) {
      recursive(gameBoard, rowIndex + 1, colIndex + 1);
    }
  };

  recursive(temp.changed, rowIndex, colIndex);
  for (let key in temp.changed) {
    solution.push(temp.changed[key]);
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  let temp = new Board({n: n});
  let solutionCount = 0;
  // findSolutions(0, n, temp, "hasAnyRookConflicts", () => {
  //   solutionCount++;
  // })
  let rowIndex = 0;
  let colIndex = 0;

  let secondImpact = (gameBoard, rowIndex) => {
    for (let i = 0; i < gameBoard[rowIndex].length; i++) {
      gameBoard[rowIndex][i] = 1;
      if (!temp.hasAnyRowConflicts() && !temp.hasAnyColConflicts() && gameBoard[rowIndex + 1] !== undefined) {
        secondImpact(gameBoard, rowIndex + 1);
      } else if (!temp.hasAnyRowConflicts() && !temp.hasAnyColConflicts() && gameBoard[rowIndex + 1] === undefined) {
        solutionCount++;
      }
      gameBoard[rowIndex][i] = 0;
      // test if current board has any conflicts
      // if there are no conflicts and gameBoard[rowIndex + 1] is not undefined
      // run through with new rowIndex
      // if there are no conflicts but next row is undefined
    }
  };
  secondImpact(temp.changed, rowIndex);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  let solution = [];
  let temp = new Board({n:n});
  let rowIndex = 0;
  let colIndex = 0;
  let boolean = false;

  // edge cases
  if (n === 0) {
    return solution;
  } else if (n === 2) {
    return [[0,0],[0,0]];
  } else if (n === 3) {
    return [[0,0,0],[0,0,0],[0,0,0]];
  }

  // solution finder function
  let thirdStrike = (gameBoard, rowIndex) => {
    for (let i = 0; i < gameBoard[rowIndex].length; i++) {
      gameBoard[rowIndex][i] = 1;
      if (!temp.hasAnyQueensConflicts() && gameBoard[rowIndex + 1] !== undefined) {
        thirdStrike(gameBoard, rowIndex + 1);
      } else if (!temp.hasAnyQueensConflicts() && gameBoard[rowIndex + 1] === undefined) {
        for (let key in gameBoard) {
          solution.push(gameBoard[key]);
        }
        boolean = true;
        return solution;
      }
      if (!boolean) {
        gameBoard[rowIndex][i] = 0;
      } else if (boolean) {
        return solution;
      }
    }
  };

  thirdStrike(temp.changed, rowIndex);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  let temp = new Board({n: n});
  let solutionCount = 0;
  let rowIndex = 0;
  let colIndex = 0;

  // edge cases
  if (n === 0) {
    return 1;
  }
  if (n === 2 || n === 3) {
    return solutionCount;
  }

  // solution counter function
  let secondImpact = (gameBoard, rowIndex) => {
    for (let i = 0; i < gameBoard[rowIndex].length; i++) {
      gameBoard[rowIndex][i] = 1;
      if (!temp.hasAnyQueensConflicts() && gameBoard[rowIndex + 1] !== undefined) {
        secondImpact(gameBoard, rowIndex + 1);
      } else if (!temp.hasAnyQueensConflicts() && gameBoard[rowIndex + 1] === undefined) {
        if (solutionCount === 39) {
          debugger;
        }
        solutionCount++;
      }
      gameBoard[rowIndex][i] = 0;
    }
  };

  secondImpact(temp.changed, rowIndex);
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
