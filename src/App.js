import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT : 'add-digit',
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR : 'clear',
  DELETE_DIGIT : 'delete-digit',
  EVALUATE : 'evaluate'
}

function reducer(state,{type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          overwrite: false,
          currOp: payload.digit,
        }
      }
      if(payload.digit === '0' && state.currOp === '0') return state;
      if (payload.digit === '.' && (state.currOp == null || state.currOp === '')) {
        return {
          ...state,
          currOp: '0.',
        };
      }
      if(payload.digit === '.' && state.currOp.includes('.')) return state;
      
      return {
        ...state, 
        currOp: `${state.currOp || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currOp == null && state.prevOp == null)  return state;
      if(state.prevOp == null){
        return ({
          ...state,
          operation: payload.operation,
          prevOp: state.currOp,
          currOp: null,
        })
      }
      if(state.currOp == null){
        return {
          ...state,
          operation: payload.operation,
        }
      }
      return {
        ...state,
        operation: payload.operation,
        prevOp: evaluate(state),
        currOp: null, 
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currOp:null,
          overwrite: false,
        }
      }
      if(state.currOp==null) return state;
      if(state.currOp.length === 1){
        return{
          ...state,
          currOp:null,
        }
      }

      return {
        ...state,
        currOp: state.currOp.slice(0,-1),
      }

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if(state.currOp==null || state.prevOp==null || state.operation==null) return state;
      return {
        ...state,
        overwrite: true,
        currOp : evaluate(state),
        operation : null,
        prevOp : null,
      };

    default:
      return state;
  }
}

function evaluate({currOp,prevOp,operation}){
  const prev = parseFloat(prevOp);
  const curr = parseFloat(currOp);

  if(isNaN(prev)||isNaN(curr))  return "";

  let computation = "";
  switch(operation){
    case '+':
      computation = prev + curr;
      break;
    case '-':
      computation = prev-curr;
      break;
    case '*':
      computation = prev*curr;
      break;
    case '/':
      computation = prev/curr;
      break;
    default:
      return "";
  }
  
  return computation.toString();
}

function App() {
  
  const [{currOp,prevOp,operation},dispatch] = useReducer(reducer,{})       //(reducer,initialState)

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{prevOp}{operation}</div>
        <div className="current-operand">{currOp}</div>
      </div>
      <button className="span-two" onClick={()=> dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation='/' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button className="span-two" onClick={()=> dispatch({type:ACTIONS.EVALUATE})}>=</button>

    </div>

  );
}

export default App;
