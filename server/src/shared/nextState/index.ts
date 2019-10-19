import { Action } from "../Action"
import { State } from "../State"

const nextState = (state: State, action: Action): State => {
  switch (action.type) {
    case "some-action":
      return state
    case "other-action":
      return state
  }
}

export default nextState