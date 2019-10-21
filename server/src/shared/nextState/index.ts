import { Action } from "../Action"
import { State } from "../State"
import _ from "lodash"

const initialState: State = {
  players: [],
  texts: [],
  ms: 0,
  arrowsStates: {},
}

const nextState = (state: State = initialState, action?: Action): State => {
  if (!action) {
    return state
  }
  switch (action.type) {
    case "some-action":
      return state
    case "ARROW": {
      return {
        ...state,
        arrowsStates: {
          ...state.arrowsStates,
          [action.userId]: {
            ...state.arrowsStates[action.userId],
            [action.data.direction]:
              state.arrowsStates[action.userId][action.data.direction] + 1,
          },
        },
      }
    }
    case "TICK": {
      return {
        ...state,
        ms: state.ms + action.data.ms,
      }
    }
    case "ADD_USER": {
      if (state.players.find(p => p.id === action.data.user.id)) {
        console.warn("This user is already in the game")
        return state
      }
      return {
        ...state,
        players: [...state.players, action.data.user],
        arrowsStates: {
          ...state.arrowsStates,
          [action.data.user.id]: { left: 0, right: 0 },
        },
      }
    }
    case "REMOVE_USER": {
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.data.userId),
        arrowsStates: _.omit(state.arrowsStates, [action.data.userId]),
      }
    }
  }
  return state
}

export default nextState
