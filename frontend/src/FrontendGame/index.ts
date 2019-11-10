import { Action } from "../shared/Action"
import { State } from "../shared/State"
import nextState from "../shared/nextState"
import GameClient from "../../../server/src/GameClient"
import { ClientCommand } from "../../../server/src/shared/ClientCommand"

type FrontendTick = {
  i: number
  actions: Action[]
  stateBefore: State | undefined
  stateAfter: State | undefined
  time: number
  processed: boolean
}

export type gameSubscription = (gameState: State) => void

export type unsubscribeFunction = () => void

const TICK_MS = 33
const DISCARD_TICKS_OLDER_THAN_MS = 5000

export default class FrontendGame {
  private subscriptions: gameSubscription[]
  private ticks: FrontendTick[]
  private stopped: boolean
  private serverTimeDelta: number

  constructor() {
    this.ticks = []
    this.subscriptions = []
    this.stopped = false
    this.serverTimeDelta = 0
  }

  stop = () => {
    this.stopped = true
  }

  start = () => {
    this.addInitialTick()
    this.nextTick()
  }

  setServerTimeDelta = (delta: number) => {
    this.serverTimeDelta = delta
  }

  serverTimeNow = (): number => {
    return new Date().getTime() - this.serverTimeDelta
  }

  onClientCommand = (command: ClientCommand) => {
    switch (command.type) {
      case "JOIN_GAME": {
        const action: Action = {
          server: true,
          type: "ADD_USER",
          data: { user: { id: command.userId } },
          time: this.serverTimeNow(),
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

  subscribe = (
    subscription: (gameState: State) => void
  ): unsubscribeFunction => {
    this.subscriptions.push(subscription)
    return () => {
      this.subscriptions = this.subscriptions.filter(s => s !== subscription)
    }
  }

  addServerTick = (state: State, time: number) => {
    let insertAfterTickIndex = this.ticks.length - 1
    let insertAfterTick = this.ticks[insertAfterTickIndex]
    for (let i = this.ticks.length - 1; i >= 0; i--) {
      const currTick = this.ticks[i]
      if (time < currTick.time) {
        currTick.processed = false
      } else {
        insertAfterTickIndex = i
        insertAfterTick = currTick
        break
      }
    }

    const newTick: FrontendTick = {
      i: insertAfterTick.i + 1,
      processed: true,
      stateAfter: state,
      stateBefore: insertAfterTick.stateAfter,
      actions: [],
      time,
    }

    insertAfterTick.processed = false

    this.ticks.splice(insertAfterTickIndex, 1, newTick)
  }

  addInitialTick = () => {
    const initialState = nextState()
    const newTick: FrontendTick = {
      i: 0,
      stateBefore: undefined,
      stateAfter: initialState,
      actions: [],
      time: this.serverTimeNow(),
      processed: true,
    }
    this.ticks.push(newTick)
  }

  nextTick = () => {
    if (this.stopped) return
    this.addTick()
    this.processTicks()
    this.sendUpdateToSubscribers()
    this.discardOldTicks()
    setTimeout(this.nextTick, TICK_MS)
  }

  private addTick = () => {
    const lastTick = this.ticks[this.ticks.length - 1]
    const newTick: FrontendTick = {
      i: lastTick.i + 1,
      stateBefore: lastTick.stateAfter,
      stateAfter: undefined,
      actions: [],
      time: this.serverTimeNow(),
      processed: false,
    }
    this.ticks.push(newTick)
  }

  private processTicks = () => {
    const pendingTicks = this.ticks.filter(t => !t.processed)
    const processedTicks = this.ticks.filter(t => t.processed)
    const lastTick = processedTicks[processedTicks.length - 1]
    let state = lastTick.stateAfter
    pendingTicks.forEach((tick: FrontendTick) => {
      tick.actions.forEach((action: Action) => {
        state = nextState(state, action)
      })
      state = nextState(state, {
        type: "USER_TICK",
        userId: "",
        data: {
          ms: TICK_MS,
        },
        time: this.serverTimeNow(),
        server: false,
      })
      tick.stateAfter = state
      tick.processed = true
    })
  }

  private discardOldTicks = () => {
    const lastTick = this.ticks[this.ticks.length - 1]
    const currentTime = lastTick.time
    const discardBeforeTime = currentTime - DISCARD_TICKS_OLDER_THAN_MS
    this.ticks = this.ticks.filter(tick => {
      const discard =
        tick.processed &&
        tick.time < discardBeforeTime &&
        tick !== this.ticks[this.ticks.length - 1]
      return !discard
    })
  }

  private sendUpdateToSubscribers = () => {
    const lastTick = this.ticks[this.ticks.length - 1]
    this.subscriptions.forEach(subscription => {
      if (!lastTick.stateAfter) {
        throw new Error("This tick is not processed")
      }
      subscription(lastTick.stateAfter)
    })
  }

  private addActionToLastTick = (action: Action) => {
    let lastTick = this.ticks[this.ticks.length - 1]
    lastTick.actions.push(action)
    lastTick.processed = false
    lastTick.stateAfter = undefined
  }
}
