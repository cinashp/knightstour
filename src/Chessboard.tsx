import './Chessboard.css';

import React, { useState } from 'react';

import knight from './knight.png';

export const Chessboard = () => {
    const initialPossibilities = [2,3,4,4,4,4,3,2,3,4,6,6,6,6,4,3,4,6,8,8,8,8,6,4,4,6,8,8,8,8,6,4,4,6,8,8,8,8,6,4,4,6,8,8,8,8,6,4,3,4,6,6,6,6,4,3,2,3,4,4,4,4,3,2];
    const [board, setboard] = useState<number[]>(new Array(64).fill(0))
    const [moves, setmoves] = useState<number[]>([])
    const [render, setrender] = useState(0);
    const [possibilities, setpossibilities] = useState(initialPossibilities);
    const [nextmoveIndex, setNextMoveIndex] = useState(-1);
    const [showClue, setShowClue] = useState(false);
    
    const updatepossiblities = (i: number, increment: boolean = false) => {
        let valueToAdd = -1;
        if(increment) {
            valueToAdd = 1;
        }

        if (i % 8 < 6 && i + 10 < 64) possibilities[i+10] = possibilities[i+10] + valueToAdd;
        if (i % 8 < 6 && i - 6  >= 0) possibilities[i-6]  = possibilities[i-6]  + valueToAdd;
        if (i % 8 > 1 && i + 6  < 64) possibilities[i+6]  = possibilities[i+6]  + valueToAdd;
        if (i % 8 > 1 && i - 10 >= 0) possibilities[i-10] = possibilities[i-10] + valueToAdd;
        if (i % 8 < 7 && i + 17 < 64) possibilities[i+17] = possibilities[i+17] + valueToAdd;
        if (i % 8 < 7 && i - 15 >= 0) possibilities[i-15] = possibilities[i-15] + valueToAdd;
        if (i % 8 > 0 && i + 15 < 64) possibilities[i+15] = possibilities[i+15] + valueToAdd;
        if (i % 8 > 0 && i - 17 >= 0) possibilities[i-17] = possibilities[i-17] + valueToAdd;


        const allowedIndices = Array.from(new Array(64),(val,index)=>index).filter((index) => isAllowed(index));

        const allowedIndicesMoves = allowedIndices.map((index) => {
            return {index: index, moves: possibilities[index]}
        });

        if(allowedIndicesMoves && allowedIndicesMoves.length > 0) {
            const nextMove = allowedIndicesMoves.reduce((prev, current) => { return prev.moves < current.moves ? prev : current}).index;
            setNextMoveIndex(nextMove);
        }
    } 

    const isGameOver = () => {
        for(let i =0 ;i<64; i++) {
            if(board[i] === 0 && possibilities[i] === 0 && !isAllowed(i)) {
                return true;
            }
        }
        return false;
    }

    const isAllowed = (index: number) => {
        if (moves.length === 0)
            return true;
        const lastIndex = moves[moves.length - 1];
        if(moves.indexOf(index) < 0 && (
            (lastIndex % 8 < 6 && index === lastIndex + 2 + 8) ||
            (lastIndex % 8 < 6 && index === lastIndex + 2 - 8) ||
            (lastIndex % 8 > 1 && index === lastIndex - 2 + 8) ||
            (lastIndex % 8 > 1 && index === lastIndex - 2 - 8) ||
            (lastIndex % 8 < 7 && index === lastIndex + 1 + 16) ||
            (lastIndex % 8 < 7 && index === lastIndex + 1 - 16) ||
            (lastIndex % 8 > 0 && index === lastIndex - 1 + 16) ||
            (lastIndex % 8 > 0 && index === lastIndex - 1 - 16)
            )
        ){
            return true;
        } 
        return false;
    }

    const getClassName = (index:number) => {
        let className = 'square';
        if ((index + Math.floor(index/8)) % 2 === 0) {
            className +=' black';
        }

        if (moves.length !=0 && isAllowed(index))
        {
            className += ' allowed';
        }

        if (showClue && index === nextmoveIndex) {
            className += ' nextmove'
        }

        if (!isAllowed(index) && moves.indexOf(index) < 0 && possibilities[index] < 1) {
            className += ' unreachable'
        }
    
        return className;
    }

    return (<>
       <div className='board'>
        <div className={'button'} onClick={() => {
            const index:number = moves.pop() || 0;
            board[index] = 0;
            updatepossiblities(index, true);
            setrender(render+1);
        }}>Undo</div>
        <div className={'button'} onClick={() => {
            setmoves([]);
            setboard(new Array(64).fill(0)); 
            setpossibilities(initialPossibilities);
        }}>Reset</div>
        <div className={'button'} onClick={() => {
            setShowClue(!showClue);
        }}>{showClue? 'Hide Clue' : 'Show Clue'}</div>

        {board.map((row, index) => {
            const div = <div className={getClassName(index)}
            onClick={() => {
                if(!isAllowed(index)) return;
                moves.push(index);
                board[index] =  moves.length;
                updatepossiblities(index);
                setrender(render+1);
            } }>
            {moves[moves.length - 1] !== index ? <> <div className='text'>{board[index] === 0 ? '' : board[index]}</div>
            <div className='supertext'>{}</div> </> :
            <div className='img'><img src={knight}/> </div>}
            </div>

            if(index%8===0){
                return <> <div className='break'></div> {div} </>
            }
            return div;
        })}
    </div>
    <div className={isGameOver()? '' : 'hidden'} >Game Over!</div> </>)
}