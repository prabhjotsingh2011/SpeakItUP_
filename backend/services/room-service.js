const roomModel = require("../models/room-model")


class roomService{
    async create(payload){
        const {topic,roomType,ownerId}=payload

        const room =await roomModel.create({
            topic,
            roomType,
            ownerId,
            speakers:[ownerId]
        })

        return room;
    }
    

    async getAllRooms(types){
        const rooms=await roomModel.find({roomType:{$in: types}}).populate('speakers').populate('ownerId').exec()
        return rooms;
    }
    async getRoom(roomId){
        const rooms=await roomModel.find({_id:roomId})
        return rooms;
    }


}

module.exports=new roomService()