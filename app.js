const { Blob, Buffer } = require('node:buffer');
const express = require('express');
const app = express();
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');
const server = require("http").createServer(app);
const cors = require("cors");
const User = require('./models/User');
const { log } = require('console');
var os = require("os");
const ffmpeg = require('fluent-ffmpeg');
const assert = require('assert');
const fs = require('fs');
const { mkdir, open, unlink, writeFile } = require('fs/promises');
const MongoGridFS = require('mongo-gridfs');
const { join, dirname } = require('path');
const { fileURLToPath } = require('url');
const { hostname } = require('node:os');

ffmpeg.setFfmpegPath(path)
const saveData = async (data, username) => {
	const videoPath = path.join(__dirname, 'video');
	const dirPath = `${videoPath}`;
	const fileName = `${username}.webm`;
	const tempFilePath = `${dirPath}/${fileName}`;
	const finalFilePath = `${dirPath}/${fileName}`;

	await mkdir(dirPath, { recursive: true });
	try {
		const videoBlob = new Blob(data, {
			type: 'video/webm'
		});
		const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());
		await writeFile(tempFilePath, videoBuffer);
		ffmpeg(tempFilePath)
			.outputOptions([
				'-c:v libvpx-vp9',
				'-c:a copy',
				'-crf 35',
				'-b:v 0',
				'-vf scale=1280:720',
			])
			.on('end', async () => {
				await unlink(tempFilePath);
			})
			.save(finalFilePath, dirPath);
	} catch (e) {
		// console.error(e);
	}
};

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/time', require('./routes/time.routes'))
app.use('/api/video', require('./routes/video.sream.routes'))
// app.use('/api/videoSearch', require('./routes/video.search.routes.js'))
app.use('/static', express.static(path.join(__dirname, 'video')))
if(process.env.NODE_ENV === 'production'){
	app.use('/',express.static(path.join(__dirname,'client','build')))
	app.get('*',(req,res)=>{
		res.sendFile(path.resolve(__dirname,'client','build','index.html'))
	})
}
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});
app.use(cors());
const PORT = 5000
app.get('/', (req, res) => {
	res.send('Running');
});
var operators = [];
const dataChunks = {};
const socketByUser = {};
io.on("connection", (socket) => {
	socket.on('user:connected', (username) => {
		if (!socketByUser[socket.id]) {
			socketByUser[socket.id] = username
		}
	})
	socket.on("createRoom", (user, operator) => {
		if (operator) {
			socket.join(operator)
			operators.push({ operator, id: socket.id })
		} else {
			socket.join(user)
		}
		io.sockets.emit('online_room', (operators));
	}
	);
	socket.on('screenData:start', ({ data, username }) => {
		if (dataChunks[username]) {
			dataChunks[username].push(data)
		} else {
			dataChunks[username] = [data]
		}
	})
	socket.on('screenData:end', (username) => {
		if (dataChunks[username] && dataChunks[username].length) {
			saveData(dataChunks[username], username)
			dataChunks[username] = []
		}
	})
	socket.on('callEnde', (data) => {
		io.sockets.in(data).emit("callEndeMessage", "true");
		operators.forEach(e => {
			if (e.operator == data) {
				io.sockets.in(data).emit("callEndeMessage", "true");
			}
		})
		if (dataChunks[data] && dataChunks[data].length) {
			saveData(dataChunks[data], data)
			dataChunks[data] = []
		}
	})
	socket.on("disconnect", () => {
		operators.forEach((e, i) => {
			if (e.id == socket.id) {
				operators.splice(i, 1);
				io.sockets.emit('online_room', (operators));
			}
		})
		const username = socketByUser[socket.id]
		if (dataChunks[username] && dataChunks[username].length) {
			saveData(dataChunks[username], username)
			dataChunks[username] = []
		}
	});
	socket.on("callUser", ({ userToCall, signalData, from, name, surname }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name, surname });
	});
	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
		operators.forEach((e, i) => {
			if (e.operator === data.room) {
				operators.splice(i, 1)
				io.sockets.emit('online_room', (operators));
			}
		})
	});
});

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}
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
