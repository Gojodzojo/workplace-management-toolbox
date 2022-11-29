import express, { json } from 'express'
import cors from "cors"
import type { TypedRequest, TypedResponse } from './usefullTypes'
import type { LoginData } from '$common/RequestTypes'
import type { StatusResponse } from '$common/ResponseTypes'

const port = 3001

const app = express()
app.use(cors())
app.use(json())


app.post('/login', (req: TypedRequest<LoginData>, res: TypedResponse<StatusResponse>) => {
    const { username, password } = req.body
    console.log(`Username: ${username}, password: ${password}`)
    res.status(200).json({ status: "Success" })
})

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})