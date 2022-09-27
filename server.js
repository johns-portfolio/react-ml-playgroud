import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = +process.env.PORT

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicPath = path.join(__dirname, 'dist')
app.use(express.static(publicPath))
app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, 'dist')});
});
app.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
