import './styles.css'
import {useReducer} from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGITS: 'add-digits',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  EVALUATE: 'evaluate',
  DELETE: 'delete'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '.' && state.currentOperand == null) {
        return {...state, currentOperand: `0${payload.digit}`}
      }

      if (payload.digit === '0' && state.currentOperand === '0') {
        return state
      }
      
      if (payload.digit === '.' && state.currentOperand.includes('.')) {
        return state
      }
      
      return {...state, currentOperand:`${state.currentOperand || ''}${payload.digit}`}
    
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.previousOperand == null){
        return {
          previousOperand: state.currentOperand, 
          operation: payload.operation,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) {
        return {...state, operation: payload.operation}
      }
      
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }
    
    case ACTIONS.CLEAR:
      return {}
    
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null) {
        return state
      }
      return{
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
        
      }
    case ACTIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }
      return {...state, currentOperand: state.currentOperand.slice(0,-1)}

  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const current = parseFloat(currentOperand);
  const prev = parseFloat(previousOperand);
  if (isNaN(prev) || isNaN(current)) return ''
  let computation = ''
  switch (operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case 'x':
      computation = prev * current
      break
    case '÷':
      computation = prev / current
      break
  }
  return computation.toString()
}

const NUM_FORMAT = new Intl.NumberFormat('en-US',{maximumFractionDigits:0})
function formatnumber(num) {
  if (num == null) {
    return 
  }
  const [before, after] = num.split('.')
  if (after == null) {
    return NUM_FORMAT.format(before)
  }
  return `${NUM_FORMAT.format(before)}.${after}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  
  

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatnumber(previousOperand)} {operation}</div>
        <div className="current-operand">{formatnumber(currentOperand)}</div>
      </div>
      <button onClick={() => dispatch({type: ACTIONS.CLEAR})} className='span-two'>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE})}>DEL</button>
      <OperationButton operation= '+' dispatch={dispatch} />
      <DigitButton digit= '1' dispatch={dispatch} />
      <DigitButton digit= '2' dispatch={dispatch} />
      <DigitButton digit= '3' dispatch={dispatch} />
      <OperationButton operation= '-' dispatch={dispatch} />
      <DigitButton digit= '4' dispatch={dispatch} />
      <DigitButton digit= '5' dispatch={dispatch} />
      <DigitButton digit= '6' dispatch={dispatch} />
      <OperationButton operation= 'x' dispatch={dispatch} />
      <DigitButton digit= '7' dispatch={dispatch} />
      <DigitButton digit= '8' dispatch={dispatch} />
      <DigitButton digit= '9' dispatch={dispatch} />
      <OperationButton operation= '÷' dispatch={dispatch} />
      <DigitButton digit= '.' dispatch={dispatch} />
      <DigitButton digit= '0' dispatch={dispatch} />
      <button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className='span-two'>=</button>
    </div>
  );
}

export default App;
