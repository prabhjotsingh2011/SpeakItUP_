const RoomDto = require("../dtos/room-dto");
const roomService = require("../services/room-service");

class roomsController{
    async create(req,res){


        const {topic,roomType} = req.body;

        if(!topic || !roomType) return res.status(400).json("all feild req for creating room ")

        const room=await roomService.create({
            topic,
            roomType,
            ownerId:req.user._id
        })

        return res.json(new RoomDto(room));
    }

    async index(req,res){
        const rooms=await roomService.getAllRooms(['open'])
        const allRooms=rooms.map((room) => new RoomDto(room))
        
        return res.json(allRooms)
    }
}

module.exports=new roomsController()