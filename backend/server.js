
require('dotenv').config();
const express = require('express')
const ACTIONS = require('./actions')

const router = require('./routes')
const DbConnect = require('./database')

const cors = require('cors')

const cookieParser = require('cookie-parser');
const { Socket } = require('socket.io');

const app = express();
const server = require('http').createServer(app);


const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        method: ['GET', 'POST']
    }
})



const PORT = process.env.PORT || 5500;
DbConnect();

const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000']
}

app.use(cookieParser())
app.use('/storage', express.static('storage'))
app.use(cors(corsOption))
app.use(express.json())
app.use(router);



app.get('/', (req, res) => {
    res.send("hello form express")
})

//socket logic

const socketUserMappping = {

}
io.on('connection', (socket) => {
    // console.log('new connection' ,socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMappping[socket.id] = user;

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

        clients.forEach(clientId => {
            // sending offer to each and every one in the room 
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user: user
            })

            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMappping[clientId]
            })
        })


        socket.join(roomId)
        // console.log(clients);
    })

    //Handle relay Ice 
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate
        })
    })

    //handle replay sdp or offer
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription
        })
    })



    //remove peer 

    const leaveRoom = ({ roomId }) => {
        const { rooms } = socket;
        Array.from(rooms).forEach(roomId => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId))

            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMappping[socket.id].id
                })

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMappping[clientId]?.id
                })
            })
            


            socket.leave(roomId)
        })
        delete socketUserMappping[socket.id];

    }

    socket.on(ACTIONS.LEAVE, leaveRoom);

})

server.listen(PORT, () => {
    console.log("server running at port 5500");
})