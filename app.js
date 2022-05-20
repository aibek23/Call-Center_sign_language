const express = require('express')
const app = express()
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const server = require("http").createServer(app);
const cors = require("cors");
const User = require('./models/User')
const { log } = require('console')

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
// app.use('/api/toCall', require('./jingle/create.channel'))
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
	socket.on("createRoom",(message ,data) =>{ 	
		socket.emit('room',socket.join(data));
		rooms=data;
		 socket.broadcast.emit('message', "приииветь");
		log(message)
		// log(socket.rooms.has("room1"))
	});
	//   socket.broadcast.emit('message', "приииветь");
	socket.on("rooms", (callback) => {
		log(rooms)
    callback(rooms);
	});

	// socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});
	
	socket.on("callUser", ({ userToCall, signalData, from, name, surname,email, }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name,surname,email, });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});
//create.channel
// app.use(express.json({ extended: true }))

// app.use('/api/auth', require('./routes/auth.routes'))
// app.use('/api/link', require('./routes/link.routes'))
// app.use('/t', require('./routes/redirect.routes'))


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
