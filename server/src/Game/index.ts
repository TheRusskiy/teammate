import { ClientCommand } from "../shared/ClientCommand"
import nextState from "../shared/nextState"
import { State } from "../shared/State"
import { Action } from "../shared/Action"
import GameClient from "../GameClient"

type Tick = {
  actions: Action[]
  stateBefore: State
  stateAfter: State
  time: Date
  processed: boolean
}

const TICK_MS = 30
const DISCARD_TICKS_OLDER_THAN_MS = 3000

export default class Game {
  private connectedClients: GameClient[]
  private ticks: Tick[]
  private stopped: boolean

  constructor() {
    this.connectedClients = []
    this.stopped = false
    this.ticks = []
  }

  public addClient = (newClient: GameClient) => {
    this.connectedClients.push(newClient)
    newClient.onClientCommand(this.onClientCommand)
    newClient.getTransport().sendServerCommand({
      type: "ID_GENERATED",
      data: {
        id: newClient.getIdentifier(),
      },
    })
    return () => {
      this.connectedClients.filter(client => {
        return client !== newClient
      })
      const action: Action = {
        server: true,
        type: "REMOVE_USER",
        data: { userId: newClient.getIdentifier() },
      }
      this.addActionToLastTick(action)
    }
  }

  stop = () => {
    this.stopped = true
  }

  start = () => {
    this.addInitialTick()
    this.nextTick()
  }

  addInitialTick = () => {
    const initialState = nextState()
    const newTick: Tick = {
      stateBefore: null,
      stateAfter: initialState,
      actions: [],
      time: new Date(),
      processed: true,
    }
    this.ticks.push(newTick)
  }

  nextTick = () => {
    if (this.stopped) return
    this.addTick()
    this.processTicks()
    this.sendStateToClients()
    this.discardOldTicks()
    setTimeout(this.nextTick, TICK_MS)
  }

  private addTick = () => {
    const lastTick = this.ticks[this.ticks.length - 1]
    const newTick: Tick = {
      stateBefore: lastTick.stateAfter,
      stateAfter: null,
      actions: [],
      time: new Date(),
      processed: false,
    }
    this.ticks.push(newTick)
  }

  private processTicks = () => {
    const pendingTicks = this.ticks.filter(t => !t.processed)
    const processedTicks = this.ticks.filter(t => t.processed)
    const lastTick = processedTicks[processedTicks.length - 1]
    let state = lastTick.stateAfter
    pendingTicks.forEach((tick: Tick) => {
      tick.actions.forEach((action: Action) => {
        state = nextState(state, action)
      })
      state = nextState(state, {
        type: "TICK",
        data: {
          ms: TICK_MS,
        },
        server: true,
      })
      tick.stateAfter = state
      tick.processed = true
    })
  }

  private discardOldTicks = () => {
    const lastTick = this.ticks[this.ticks.length - 1]
    const currentTime = lastTick.time
    const discardBeforeTime = new Date(
      currentTime.getTime() - DISCARD_TICKS_OLDER_THAN_MS
    )
    this.ticks = this.ticks.filter(tick => {
      const discard = tick.processed && tick.time < discardBeforeTime
      return !discard
    })
  }

  private sendStateToClients = () => {
    const lastTick = this.ticks[this.ticks.length - 1]
    this.connectedClients.forEach(client => {
      client.getTransport().sendServerCommand({
        type: "SET_STATE",
        data: {
          state: lastTick.stateAfter,
        },
      })
    })
  }

  private onClientCommand = (command: ClientCommand) => {
    switch (command.type) {
      case "START_GAME": {
        const action: Action = {
          server: true,
          type: "ADD_USER",
          data: { user: { id: command.userId } },
        }
        this.addActionToLastTick(action)
        break
      }
      case "PLAYER_ACTION": {
        this.addActionToLastTick(command.data.action)
        break
      }
    }
  }

  private addActionToLastTick = (action: Action) => {
    const lastTick = this.ticks[this.ticks.length - 1]
    lastTick.actions.push(action)
    lastTick.processed = false
  }
}
