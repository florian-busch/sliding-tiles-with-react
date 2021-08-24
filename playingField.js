"use strict";
import React, { useState } from "react";

//check if puzzle is solvable (if number of inverted tiles = equal number --> puzzle = solvable)
const checkIfSolvableAndUnordered = shuffledArray => {
  let inversions = 0;
  for (let i = 0; i < shuffledArray.length; i++) {
    shuffledArray.slice(i).forEach(element => {if (element < shuffledArray[i]) {
    inversions++;
    }})
  };

  return inversions % 2 == 0?  true: false;
};

//create a shuffled or an ordered array with "emptyField" at last position of last row
  const createShuffeledOrOrderedArray = (props, shuffleState) => {
    const length = props.size*props.size;
    let arrayWithNumbers = Array(length).fill().map((_, i) => i+1);
    let finishedArray = [];
    
    //create shuffled array
    if (shuffleState == true) {
      arrayWithNumbers.pop()
      for (let i = arrayWithNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayWithNumbers[i], arrayWithNumbers[j]] = [arrayWithNumbers[j], arrayWithNumbers[i]];
      };
      //check if shuffled array is solvable && != orderedArray: solvable? continue : return function to useState for next try
      if (checkIfSolvableAndUnordered(arrayWithNumbers)) {
        } else {
          return createShuffeledOrOrderedArray(props, true)
        };

      arrayWithNumbers.push("emptyTile");
    }
    //no shuffeling when array is used for checkWinningCondition
    else {
      arrayWithNumbers = arrayWithNumbers.map(number => number==length? "emptyTile":number);
    };
    //create two-dimensional array
    while(arrayWithNumbers.length) {finishedArray.push(arrayWithNumbers.splice(0, props.size))};
    return finishedArray;
};

//main function
const RenderPlayingfield = props => {

  const [playingfield, changePlayingField] = useState(createShuffeledOrOrderedArray(props, true));

  //after each click compares state of playingfield with a finished playingfield
  const checkWinningCondition = () => {
  const finishedPlayfield = createShuffeledOrOrderedArray(props);
  if (playingfield.join() == finishedPlayfield.join()) {alert("Game won")}
  };

  //swaps tiles and returns updated playingfield-array
  const swapTiles = (rowClickedTile, colClickedTile, rowEmptyTile, colEmptyTile) => {
    const updatedArray = playingfield.map(el => el = el);
    [updatedArray[rowClickedTile][colClickedTile], updatedArray[rowEmptyTile][colEmptyTile]] = [updatedArray[rowEmptyTile][colEmptyTile], updatedArray[rowClickedTile][colClickedTile]];
    return(updatedArray)
  }; 

  //handle clicks and update useState; after each click checks if winning condition is reached 
  const handleClick = (clickedTile) => {
    const rowClickedTile = Number(clickedTile.attributes.row.value);
    const colClickedTile = Number(clickedTile.attributes.col.value);
    
    if (rowClickedTile < playingfield.length -1 && (playingfield[rowClickedTile + 1][colClickedTile] == "emptyTile")) {
        changePlayingField(swapTiles(rowClickedTile, colClickedTile, rowClickedTile + 1, colClickedTile));
    };
    if (rowClickedTile > 0 && (playingfield[rowClickedTile - 1][colClickedTile] == "emptyTile")) {
        changePlayingField(swapTiles(rowClickedTile, colClickedTile, rowClickedTile - 1, colClickedTile));
    };
    if (colClickedTile > 0 && (playingfield[rowClickedTile][colClickedTile - 1] == "emptyTile")) {
        changePlayingField(swapTiles(rowClickedTile, colClickedTile, rowClickedTile, colClickedTile - 1));
    };
    if (colClickedTile < playingfield[0].length - 1 && (playingfield[rowClickedTile][colClickedTile + 1] == "emptyTile")) {
        changePlayingField(swapTiles(rowClickedTile, colClickedTile, rowClickedTile, colClickedTile + 1));
    };
    checkWinningCondition();
  };

  //creates rows and fields based on state (playfield) of useState
  const RenderRow = props => {
      return (<table><tbody>
        {props.field.map((fields, row) => <RenderTiles fields={fields} key={row} row={row}/>)}
        </tbody></table>
      );
  };

    const RenderTiles = props => {
      return (<tr key={props.i}>
      {props.fields.map((field, i) =>
      <td className="cell"
      id={field}
      row={props.row}
      col={i}
      key={i}
      onClick={() => handleClick(event.target)}>{field}</td>)}
      </tr>
      );
    };

  return <RenderRow field={playingfield}/>
};

module.exports = { RenderPlayingfield };