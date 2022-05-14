const express = require('express')
const app = express()
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const server = require("http").createServer(app);
const cors = require("cors");
const { log } = require('console')

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});


io.on("connection", (socket) => {
	socket.emit('subscribeToTimer', (e) => {
		console.log('client is subscribing to timer with interval ',e);
	  });
    console.log("hii")
	socket.on('adminID', () => { socket.join("room1") });
	socket.emit("me", socket.id);
	console.log(socket.rooms);
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});


app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// const PORT = config.get('port') || 5000
// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
