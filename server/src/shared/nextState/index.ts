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
      return {
        ...state,
        players: [...state.players, action.data.user],
      }
    }
  }
}

export default nextState
