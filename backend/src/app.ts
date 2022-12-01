import express, { json, static as staticDir } from 'express'
import cors from "cors"
import { resolve as resolvePath } from 'path'
import type { TypedRequest, TypedResponse } from './usefullTypes'
import type { AuthData } from '$common/RequestTypes'
import type { StatusResponse } from '$common/ResponseTypes'

const port = 3001

const app = express()
app.use(cors())
app.use(json())
app.use(staticDir("public"))

app.post('/login', (req: TypedRequest<AuthData>, res: TypedResponse<StatusResponse>) => {
    const { username, password } = req.body
    console.log(`Username: ${username}, password: ${password}`)
    res.status(200).json({ status: "Success" })
})

app.put('/register', (req: TypedRequest<AuthData>, res: TypedResponse<StatusResponse>) => {
    const { username, password } = req.body
    console.log(`Username: ${username}, password: ${password}`)
    res.status(200).json({ status: "Success" })
})

app.get('*', (_, res) => {
    res.sendFile(resolvePath(__dirname + '/../public/index.html'))
})

app.listen(port, function () {
    console.log(`App is listening on port ${port}!`)
})