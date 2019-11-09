export type KeyValue =
  | "ArrowDown"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | "Escape"
  | "Space"

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
    if ((event as KeyboardEvent).code === key.value) {
      if (state.isDown && key.release) {
        key.release()
      }
      state.isDown = false
      state.isUp = true
      event.preventDefault()
    }
  }

  key.downHandler = event => {
    if ((event as KeyboardEvent).code === key.value) {
      if (state.isUp && key.press) {
        key.press()
      }
      state.isDown = true
      state.isUp = false
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
