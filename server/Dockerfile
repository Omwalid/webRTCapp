FROM node
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
RUN npm install -g peer
COPY . .
EXPOSE 5000 
EXPOSE 5001
CMD peerjs --port 5001 & npm run dev
# ["sh", "-c", "peerjs --port 5001 && npm run dev"] 
