document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault()
    let updates = document.getElementById('updates')
    updates.innerHTML = ''
    let name = document.getElementById('name').value
    let socket = io('http://localhost:3000/')
    socket.on('connect', (data) => {
        socket.emit('sendName', name)
        socket.on('serverUpdates', (msg) => {
            updates.innerHTML += msg
            updates.innerHTML += '<br />'
        })
        socket.on('disconnect', () => {
            console.log('Connection disconnected')
        })
    })
})
