import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown'
  console.log('アクセス元IP:' + ip)

  return c.text(`Hello Hono! Your IP is ${ip}`)
})

export default app
