import React, { useEffect } from "react"
import keyboardSubscriber, { KeyValue } from "./keyboardSubscriber"

type Props = {
  onPress: () => void
  onRelease: () => void
  keyValue: KeyValue
}

const Keyboard: React.FC<Props> = ({ onPress, onRelease, keyValue }: Props) => {
  useEffect(() => {
    const handler = keyboardSubscriber(keyValue)
    handler.press = onPress
    handler.release = onRelease
    return () => {
      handler.unsubscribe()
    }
  }, [onPress, onRelease, keyValue])
  return null
}

export default React.memo(Keyboard)
