 const canPIP = () => "pictureInPictureEnabled" in document && document.pictureInPictureEnabled;
 export const supportsOldSafariPIP = () => { const video = document.createElement("video");
 return ( canPIP() && video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === "function" );};
 export const supportsModernPIP = () => { const video = document.createElement("video");
 return ( canPIP() && video.requestPictureInPicture && typeof video.requestPictureInPicture === "function" )};
 export const supportsPIP = ()=> supportsOldSafariPIP() || supportsModernPIP();   

export default canPIP;


// socket.emit('room',socket.join(message))
// 		socket.broadcast.emit('open_room', data);
// 		var clients = io.sockets.adapter.rooms.get(data);
// 		log(clients)
// 		if (clients) {
// 			console.log(clients.size,"_____size___");
// 			if (clients.size == 3) {
// 				socket.emit('message',"занять")
// 				socket.broadcast.emit('open_room', "занять");
// 				socket.emit('room',"занять")
// 				log("room full")
// 		   }
// 		 } 