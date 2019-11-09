import { Action } from "../Action"
import {
  State,
  MutableState,
  TankState,
  TANK_WIDTH,
  TANK_HEIGHT,
  TANK_GUN_HEIGHT,
  Position,
  MAP_WIDTH,
  MAP_HEIGHT,
  ProjectileState,
} from "../State"
import produce from "immer"

const initialState: State = {
  players: [],
  ms: 0,
  tanks: [],
  projectiles: [],
}

const getRotation = function(x: number, y: number, oldValue = 0) {
  let rotation
  if (y === 0 && x === 0) {
    return oldValue
  } else {
    rotation = degrees(
      Math.acos(x / Math.pow(Math.pow(x, 2) + Math.pow(Math.abs(y), 2), 0.5))
    )
  }
  if (y > 0) {
    rotation = 360 - rotation
  }
  return rotation
}

const tankBounding = (tank: Position): number[] => {
  return [
    tank.x - TANK_WIDTH / 2,
    tank.x + TANK_WIDTH / 2,
    tank.y - TANK_HEIGHT / 2,
    tank.y + TANK_HEIGHT / 2,
  ]
}

const collision = (position1: Position, position2: Position): boolean => {
  const [b1x1, b1x2, b1y1, b1y2] = tankBounding(position1)
  const [b2x1, b2x2, b2y1, b2y2] = tankBounding(position2)

  return b1x1 <= b2x2 && b1x2 >= b2x1 && b1y1 <= b2y2 && b1y2 >= b2y1
}

const insideMapBorder = (position: Position): boolean => {
  const yOffset = -TANK_HEIGHT
  const [x1, x2, y1, y2] = tankBounding(position)
  return (
    x1 > 0 &&
    x1 < MAP_WIDTH &&
    x2 > 0 &&
    x2 < MAP_WIDTH &&
    y1 > yOffset &&
    y1 < MAP_HEIGHT + yOffset &&
    y2 > yOffset &&
    y2 < MAP_HEIGHT + yOffset
  )
}

const rad = (degrees: number): number => (degrees * Math.PI) / 180

const degrees = (rad: number): number => (rad * 180) / Math.PI

const reducer = (draft: MutableState, action?: Action) => {
  if (!action) return

  switch (action.type) {
    case "some-action":
      return
    case "TANK_SHOOT":
      const tank = draft.tanks.find(t => t.userId === action.data.userId)
      if (!tank) return
      const angle = action.data.angle
      const projectileSpeed = 5
      const xMult = Math.cos(rad(angle))
      const xSpeed = xMult * projectileSpeed
      const yMult = -Math.sin(rad(angle))
      const ySpeed = yMult * projectileSpeed
      const initX = tank.x + (TANK_HEIGHT / 2 + TANK_GUN_HEIGHT) * xMult
      const initY =
        tank.y +
        (TANK_HEIGHT / 2 + TANK_GUN_HEIGHT) * yMult +
        (TANK_HEIGHT + TANK_GUN_HEIGHT) / 2
      draft.projectiles.push({
        angle,
        x: initX - xSpeed,
        y: initY - ySpeed,
        xSpeed,
        ySpeed,
      })
      return
    case "MOVE_TANK": {
      const tank = draft.tanks.find(t => t.userId === action.userId)
      if (!tank) return
      switch (action.data.direction) {
        case "up": {
          tank.ySpeed = 1
          break
        }
        case "stop-up": {
          tank.ySpeed = 0
          break
        }
        case "down": {
          tank.ySpeed = -1
          break
        }
        case "stop-down": {
          tank.ySpeed = 0
          break
        }
        case "left": {
          tank.xSpeed = -1
          break
        }
        case "stop-left": {
          tank.xSpeed = 0
          break
        }
        case "right": {
          tank.xSpeed = 1
          break
        }
        case "stop-right": {
          tank.xSpeed = 0
          break
        }
      }
      return
    }
    case "TICK": {
      draft.ms += action.data.ms
      draft.tanks.forEach(tank => {
        const newPosition: Position = {
          x: tank.x + tank.xSpeed,
          y: tank.y + tank.ySpeed,
        }
        const wouldCollide = draft.tanks.find(t => {
          return t !== tank && collision(newPosition, t)
        })
        const wouldHitBorder = !insideMapBorder(newPosition)
        if (wouldCollide || wouldHitBorder) {
          tank.xSpeed = 0
          tank.ySpeed = 0
        } else {
          tank.x = newPosition.x
          tank.y = newPosition.y
          // acceleration
          tank.xSpeed *= 1.05
          tank.ySpeed *= 1.05
        }
        if (tank.xSpeed > 3) {
          tank.xSpeed = 3
        }
        if (tank.xSpeed < -3) {
          tank.xSpeed = -3
        }
        if (tank.ySpeed > 3) {
          tank.ySpeed = 3
        }
        if (tank.ySpeed < -3) {
          tank.ySpeed = -3
        }
        tank.rotation = getRotation(tank.xSpeed, tank.ySpeed, tank.rotation)
      })

      const projectilesToRemove: ProjectileState[] = []
      draft.projectiles.forEach(prj => {
        const newPosition: Position = {
          x: prj.x + prj.xSpeed,
          y: prj.y + prj.ySpeed,
        }
        const wouldHitBorder = !insideMapBorder(newPosition)
        if (wouldHitBorder) {
          projectilesToRemove.push(prj)
        }
        prj.x = newPosition.x
        prj.y = newPosition.y
      })
      draft.projectiles = draft.projectiles.filter(
        prj => !projectilesToRemove.includes(prj)
      )
      return
    }
    case "ADD_USER": {
      if (draft.players.find(p => p.id === action.data.user.id)) {
        console.warn("This user is already in the game")
        return
      }
      draft.players.push(action.data.user)
      draft.tanks.push({
        x: TANK_WIDTH / 2 + 1,
        y: TANK_HEIGHT / 2 + 1,
        xSpeed: 0,
        ySpeed: 0,
        userId: action.data.user.id,
        rotation: 0,
      })
      return
    }
    case "REMOVE_USER": {
      draft.players = draft.players.filter(p => p.id !== action.data.userId)
      draft.tanks = draft.tanks.filter(t => t.userId !== action.data.userId)
    }
  }
}

type baseReducer = (state: MutableState, action?: Action) => void

const nextState = produce<baseReducer>(reducer, initialState)

export default nextState
