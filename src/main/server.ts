import 'dotenv/config'
import { app } from './config/app'

const port = Number(process.env.PORT) ?? 3333

app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err != null) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
})
