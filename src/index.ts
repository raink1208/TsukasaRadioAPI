import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from 'hono/adapter'
import type { D1Database } from '@cloudflare/workers-types'

export interface Guest {
  name: string
  affiliation?: string
  icon: string
  urls: SNSUrls
}

export interface SNSUrls {
  youtube?: string
  twitter?: string
  official?: string
}

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('/*', cors())

app.get('/guests', async (c) => {
  const { DB } = env(c)

  const query = 'SELECT name, affiliation, icon, youtube_url, twitter_url, official_url FROM guests'
  const { results } = await DB.prepare(query).all()

  const guests: Guest[] = results.map((row: any) => ({
    name: row.name,
    icon: row.icon,
    affiliation: row.affiliation || undefined,
    urls: {
      youtube: row.youtube_url || undefined,
      twitter: row.twitter_url || undefined,
      official: row.official_url || undefined,
    }
  }))

  return c.json(guests)
})

export default app
