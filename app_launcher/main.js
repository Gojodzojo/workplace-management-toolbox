import express from 'express'
import { exec } from 'child_process'
const app = express()
const port = 3000

let rawdata = fs.readFileSync('apps.json');
let apps = JSON.parse(rawdata);

app.get('/', (req, res) => {
    apps.forEach(appPath => {
      exec(appPath)
    })
    
    res.send('Success')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})