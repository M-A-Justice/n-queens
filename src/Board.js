// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

    */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // create a tracker count variable = 0
      let count = 0;
      // iterate over index row
      /*
        - if current === 1
        - increment
        - if count equals > 1 return that there is a conflict and return true
      */
      for (let i = 0; i < rowIndex.length; i++) {
        if (rowIndex[i] === 1) {
          count++;
        }
        if (count > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      /*
        - run rowConlflictAt for each row
        - if rowConlflictAt returns true, return true
        - if no conflicts found, return false
      */
      let board = this.rows();
      for (let row in board) {
        let boolean = this.hasRowConflictAt(board[row]);
        if (boolean) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      /*
        - create tracker variable at 0
        - iterate over each nested array checking specific index
        - if index equals one, increment tracker
        - if tracker is greater than one, return true
      */
      // let tracker = 0;
      // for (let num in colIndex) {
      //   if (typeof colIndex[num] !== 'number') {
      //     // console.log(colIndex[num]);
      //     if (colIndex[num][0] === 1) {
      //       tracker++;
      //     }
      //     if (tracker > 1) {
      //       return true;
      //     }
      //   }
      // }
      let tracker = 0;
      let board = this.rows();
      for (let i = 0; i < board.length; i++) {
        if (tracker > 1) {
          return true;
        }
        if (board[i][colIndex] === 1) {
          tracker++;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let board = this.rows();
      for (let i = 0; i < board.length; i++) {
        let boolean = this.hasColConflictAt(i);
        if (boolean) {
          return true;
        }
      }
      // let boolean = this.hasColConflictAt(this.attributes);
      //  console.log(this.attributes);
      //  console.log(boolean);
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // majorDiagonalColumnIndexAtFirstRow
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndex, rowIndex) {
      let board = this.rows();
      let nextRow = rowIndex + 1;
      let nextCol = majorDiagonalColumnIndex + 1;
      if (rowIndex > board.length - 1 || majorDiagonalColumnIndex > board[0].length) {
        return false;
      } else if (board[rowIndex][majorDiagonalColumnIndex] === 1) {
        return true;
      } else {
        return this.hasMajorDiagonalConflictAt(nextCol, nextRow);
      }
      // return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let board = this.rows();
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === 1) {
            if (this.hasMajorDiagonalConflictAt(j + 1, i + 1)) {
              return true;
            }
          }
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndex, rowIndex) {
      let board = this.rows();
      let nextRow = rowIndex + 1;
      let nextCol = minorDiagonalColumnIndex - 1;
      if (rowIndex > board.length - 1 || minorDiagonalColumnIndex < 0) {
        return false;
      } else if (board[rowIndex][minorDiagonalColumnIndex] === 1) {
        return true;
      } else {
        return this.hasMinorDiagonalConflictAt(nextCol, nextRow);
      }
      // return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let board = this.rows();
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === 1) {
            if (this.hasMinorDiagonalConflictAt(j - 1, i + 1)) {
              return true;
            }
          }
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
