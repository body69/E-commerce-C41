import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import bootstrap from './src/bootstrap.js'
import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors())
const port = +process.env.PORT
bootstrap(app,express)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))