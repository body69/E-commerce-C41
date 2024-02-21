import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import bootstrap from './src/bootstrap.js'
import express from 'express'
const app = express()
const port = +process.env.PORT
bootstrap(app,express)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))