# webRTCapp
a video call chat with peerjs and socket.io

## How to use the app 
#### Setting up the app 
Since WebRTC API, getUserMedia works only with https, we need to connect to the app with localhost ( if you deployed the app in a VM, you can use tunnels "port 8000 and 5000")

1- with docker compose :
   
   after cloning the repo,run " cd webRTCapp && docker-compose up" <br/>
   PS: Make sure port 8000 and 5000 are not used, otherwise modify the docker-compose.yml.
   
2- with docker : 
   
   run :
     docker run --name webRTCapp_front -d -p 8000:80 omwalid/webrtcapp_front:v1.1.5 <br/>
     docker run --name webRTCapp_back -d -p 5000:5000 omwalid/webrtcapp_back:v1.2
     
PS: you can use the app without docker image, either by setting up a web server with DocumentRoot: webRTCapp/client/code or opening only the index.html in webRTCapp/client/code, without forgetting to start up the nodeJS server with "cd webRTCapp/server && npm run dev"


#### Start using the app :
Go to localhost:8000/ and allow the use of Camera and microphone. Tadaaaa !! Now you can create and join meetings  

## Docker Images : 
webRTCapp front : https://hub.docker.com/r/omwalid/webrtcapp_front  <br/>
webRTCapp back  : https://hub.docker.com/r/omwalid/webrtcapp_back
