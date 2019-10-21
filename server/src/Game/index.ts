import { WebsocketTransport } from "../WebsocketTransport"
import { ClientCommand } from "../shared/ClientCommand"
import nextState from "../shared/nextState"
import { State } from "../shared/State"
import { Action } from "../shared/Action"
const uuidv1 = require("uuid/v1")

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
  private connectedClients: WebsocketTransport[]
  private ticks: Tick[]
  private stopped: boolean

  constructor() {
    this.connectedClients = []
    this.stopped = false
    this.ticks = []
  }

  public addClient = (transport: WebsocketTransport) => {
    this.connectedClients.push(transport)
    transport.onClientCommand(this.onClientCommand)
    return () => {
      this.connectedClients.filter(client => {
        return client !== transport
      })
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
      client.sendServerCommand({
        type: "SET_STATE",
        data: {
          state: lastTick.stateAfter,
        },
      })
    })
  }

  private onClientCommand = (command: ClientCommand) => {
    console.log(command)
    switch (command.type) {
      case "START_GAME": {
        const lastTick = this.ticks[this.ticks.length - 1]
        const action: Action = {
          server: true,
          type: "ADD_USER",
          data: { user: { id: uuidv1() } },
        }
        lastTick.actions.push(action)
        lastTick.processed = false
        break
      }
      case "PLAYER_ACTION": {
        const lastTick = this.ticks[this.ticks.length - 1]
        lastTick.actions.push(command.data.action)
        lastTick.processed = false
        break
      }
    }
  }
}
