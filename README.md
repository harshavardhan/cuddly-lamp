## Build and running instructions

### Rogue server

-   Change working directory `cd rogue`
-   Run `npm install`
-   Run `npm start`
-   Server runs on port 3001
-   Endpoint : `http://localhost:3001/hello`

### Undeterred server

-   Change working directory `cd undeterred`
-   Run `npm install`
-   Run `npm start`
-   Server runs on port 3000
-   Endpoint : `http://localhost:3000/`

### Client (web)

-   Change working directory `cd client`
-   Open `index.html` via browser and send requests to undeterred server

## About

### Rogue server

-   Simulates a faulty server. Returns one among 200, 503 and 504 with equal probability
-   Returns a hello msg with received query parameter name

### Undeterred server

-   Acts as an intermediary between client and rogue server
-   Max retries = 5, Initial backoff time = 500 ms which keeps on doubling after each failure
-   Streams events to clients via websockets
-   Logs success and failure events

### Client

-   Web client which sends a name to undeterred server to receive its hello message
-   Updates DOM with streaming events from undeterred server
