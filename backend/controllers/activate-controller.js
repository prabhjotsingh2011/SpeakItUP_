const jimp = require("jimp");
const path = require('path');
const userDto = require("../dtos/user-dto.js");
const userService = require("../services/user-service");


class ActivateController {
    async activate(req, res) {
        const { name, avatar } = req.body;
        if (!name || !avatar) {
            res.status(400).json({ messsage: "All fields req" })
        }

        const buffer = Buffer.from(avatar.replace(`data:image/png;base64,`, ''), 'base64')

        const imagepath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`
        try {
            const jimpResp = await jimp.read(buffer);
            jimpResp.resize(150, jimp.AUTO).write(path.resolve(__dirname, `../storage/${imagepath}`))
        } catch (error) {
            res.status(500).json({ message: 'Coulnot process the Image' })
            return
        }

        const userId = req.user._id || req.user.id;

        try {
            const user =await  userService.findUser({ _id: userId })
            if (!user) {
                res.status(404).json({ messsage: 'user not found' })
            }


            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagepath}`;
 
            user.save();
            res.json({ userDt: new userDto(user), auth: true })
            return
        } catch (error) {
            res.status(500).json({ message: 'something went wrong' })
        }
    }
}

module.exports = new ActivateController();