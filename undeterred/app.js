const socketio = require('socket.io')
const axios = require('axios')

const port = 3000
const maxRetries = 5
// Initial backoff time in ms doubled on each faulty req
const initialBackoff = 500
// add some path later
const io = socketio(port, {
    cors: {
        origin: '*'
    }
})

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const evalTimeDiff = (prevTimeObj) => {
    let present = new Date().getTime()
    let diff = present - prevTimeObj.time
    prevTimeObj.time = present
    return diff
}

const getHelloResource = async (
    socket,
    numRetries,
    nextBackoff,
    name,
    prevTimeObj
) => {
    try {
        // :: Try to fix cache issues in better ways
        let timeElapsed = evalTimeDiff(prevTimeObj)

        if (numRetries == 0) console.log(`Attempting to fetch ${name}`)
        else {
            console.log(
                `Attempting retry ${numRetries} on ${name} after ${timeElapsed} ms`
            )
        }

        let response = await axios.get(
            `http://localhost:3001/hello?name=${name}&timestamp=${new Date().getTime()}`
        )
        // Try using common strings for log and emit
        console.log(`Success on fetch on ${name}`)
        socket.emit('serverUpdates', 'Success on fetch')
        socket.emit(
            'serverUpdates',
            '<b> Rogue server says </b> ' + response.data.msg
        )
    } catch (error) {
        if (numRetries == 0) console.log(`Failure on initial fetch on ${name}`)
        else console.log(`Failure on retry ${numRetries} on ${name}`)

        if (numRetries < maxRetries) {
            numRetries++
            // sleeping for nextBackoff time
            await sleep(nextBackoff)
            socket.emit('serverUpdates', `Retry ${numRetries}`)
            await getHelloResource(
                socket,
                numRetries,
                nextBackoff * 2,
                name,
                prevTimeObj
            )
        } else {
            console.log(`Max amount of retries reached on ${name}`)
            socket.emit('serverUpdates', 'Max amount of retries reached')
        }
    }
}

io.on('connection', (socket, req) => {
    socket.on('sendName', async (name) => {
        try {
            let numRetries = 0
            let nextBackoff = initialBackoff
            let prevTimeObj = { time: new Date().getTime() }
            await getHelloResource(
                socket,
                numRetries,
                nextBackoff,
                name,
                prevTimeObj
            )
        } catch (error) {
            // ideally error should always be empty
            // :: Think of cases like connection disconnect and connect later
            console.log(error)
        }
        socket.disconnect(true)
        console.log(`Connection ${name} disconnected`)
    })
})
