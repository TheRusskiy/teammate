import { Action } from "../Action"
import { State } from "../State"

const initialState: State = {
  players: [],
  texts: [],
  ms: 0,
}

const nextState = (state: State = initialState, action?: Action): State => {
  if (!action) {
    return state
  }
  switch (action.type) {
    case "some-action":
      return state
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
      }
    }
    case "REMOVE_USER": {
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.data.userId),
      }
    }
  }
  return state
}

export default nextState
