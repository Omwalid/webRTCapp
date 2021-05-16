const socket = io("http://localhost:5000/");
//connect to peerjs server that generate id for user
const peer = new Peer(undefined, {
    host: 'localhost',
    port: '5000',
    path: '/peerjs'
})

// enable join button after room_id input
document.querySelector('input').addEventListener("input", (e) => {
    if (document.querySelector('input').value.length === 0)
        document.getElementById("join_button").disabled = true;
    else document.getElementById("join_button").disabled = false;
})

// object to collect peers connected
const peers = {}

// get div where the streams will be present after joining a room
const videoGrid = document.getElementById("video-grid")

// get div where my stream will be present before joigning
const myvideoDiv = document.getElementById("mystream")
var mystream;

// create video element and mute it 
const myVideo = document.createElement('video')
myVideo.className = "col-lg-6 col-md-9 col-sm-10"
myVideo.muted = true

// get stream and add it to the page

if (!navigator.mediaDevices) {

document.getElementById('divForm').remove()
alert('your browser didn\'t allow to get media or you refused to use camera and mic')

}
else {
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    mystream = stream
    addVideoStream(myVideo, stream, myvideoDiv)

// listen to peers' call
    peer.on('call', call => {

        // answer the call and save the "peer->call"
        call.answer(stream)
        peers[call.peer] = call

        // creat a video and add to it the peer stream
        const video = document.createElement('video')
        call.on('stream', receiver_stream => {
            video.className = "col-3 col-xs-4 " 
            addVideoStream(video, receiver_stream, videoGrid)
        })

        // when the call close  we remove the video
        call.on('close', () => {
            video.remove()
        })
    })

    socket.on("user-connected", user_id => {
        connectToNewUser(user_id, stream)
    })
}).catch(err=>{
    alert('your browser didn\'t allow to get media or you refused to use camera and mic')
    document.getElementById('divForm').remove()
})

}
// once connected to peerjs server and got id
peer.on('open', user_id => {

    document.getElementById('create_button').addEventListener("click", (e) => {
        socket.emit("join-room", undefined, user_id)
    })

    document.getElementById('join_button').addEventListener("click", (e) => {
        let room_id = document.querySelector('input').value
        socket.emit("join-room", room_id, user_id)
    })

    document.getElementById('bye_button').addEventListener("click", (e) => {
        socket.emit("quit-room")
    })

    socket.on("room-joined", room_id => {
        document.getElementById('room_id_output').innerHTML = room_id
        document.querySelector('input').value = ""
        document.getElementById('bye_button').hidden = false
        document.getElementById('toggler').hidden = false
        document.getElementById('divForm').style.visibility = "hidden";
        myvideoDiv.getElementsByTagName("video")[0].remove()
        myVideo.className = "col-3 col-xs-4"
        addVideoStream(myVideo, mystream, videoGrid)
    })

    socket.on("quit-done", () => {
        document.getElementById('toggler').hidden = true
        document.getElementById('room_id_output').innerHTML = ""
        document.getElementById('bye_button').hidden = true
        document.getElementById('divForm').style.visibility = "visible";
        videoGrid.innerHTML = ""
        myVideo.className = "col-lg-6 col-md-9 col-sm-10"
        addVideoStream(myVideo, mystream, myvideoDiv)
    })


})

//when the peer disconnect, we close the call
socket.on("user-disconnected", (user_id) => {
    if (peers[user_id]) peers[user_id].close();
})

// function to add user's stream to the a target div in the page
function addVideoStream(video, stream, target) {
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => video.play())
    target.append(video)
}

// function to connect to new user
function connectToNewUser(user_id, stream) {
    const call = peer.call(user_id, stream)

    const video = document.createElement('video')
    call.on('stream', userStream => {
        video.className = "col-3 col-xs-4 "
        addVideoStream(video, userStream, videoGrid)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[user_id] = call
}
