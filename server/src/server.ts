import * as http from "http"
import setupWebsocketServer from "./wss-server"

const PORT = 3001 // 26501

const server = http.createServer()

setupWebsocketServer({ server })

server.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`)
})
