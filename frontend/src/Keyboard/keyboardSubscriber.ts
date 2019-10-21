export type KeyValue =
  | "ArrowDown"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | "Escape"

type KeyType = {
  downHandler: EventListenerOrEventListenerObject
  upHandler: EventListenerOrEventListenerObject
  value: KeyValue
  press?: () => void
  release?: () => void
  unsubscribe: () => void
}

const keyboardSubscriber = (value: KeyValue) => {
  const state = {
    isDown: false,
    isUp: true,
  }

  let key: KeyType = {
    value,
    press: undefined,
    release: undefined,
    upHandler: () => {},
    downHandler: () => {},
    unsubscribe: () => {},
  }

  key.upHandler = event => {
    if ((event as KeyboardEvent).key === key.value) {
      console.log("UP", key.value)
      // console.log("state.isUp", state.isUp)
      // console.log("state.isDown", state.isDown)
      console.log(state)
      if (state.isDown && key.release) {
        key.release()
      }
      state.isDown = false
      state.isUp = true
      console.log(state)
      // console.log("state.isUp", state.isUp)
      // console.log("state.isDown", state.isDown)
      event.preventDefault()
    }
  }

  key.downHandler = event => {
    if ((event as KeyboardEvent).key === key.value) {
      console.log("DOWN", key.value)
      console.log(state)
      // console.log("isUp", state.isUp)
      // console.log("state.isDown", state.isDown)
      if (state.isUp && key.press) {
        key.press()
      }
      state.isDown = true
      state.isUp = false
      console.log(state)
      // console.log("state.isUp", state.isUp)
      // console.log("state.isDown", state.isDown)
      event.preventDefault()
    }
  }
  const downListener = (key.downHandler as (event: KeyboardEvent) => void).bind(
    key
  )
  const upListener = (key.upHandler as (event: KeyboardEvent) => void).bind(key)

  window.addEventListener("keydown", downListener, false)
  window.addEventListener("keyup", upListener, false)

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener)
    window.removeEventListener("keyup", upListener)
  }

  return key
}

export default keyboardSubscriber
