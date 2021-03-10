const express = require('express')

const app = express()
const port = 3001

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

app.use(express.json())

app.get('/hello', (req, res) => {
    let reply = {
        status: 200,
        msg: 'Hello'
    }

    // Choose one error code among 200, 503 and 504 with equal probability
    const num = Math.floor(Math.random() * 3)

    let name = 'stranger'
    // Validate later
    if (req.query.name) name = req.query.name
    reply.msg += ' '
    reply.msg += name

    if (num == 0) reply.status = 503
    else if (num == 1) reply.status = 504

    res.status(reply.status)
    // delete reply.status
    res.json(reply)
})
