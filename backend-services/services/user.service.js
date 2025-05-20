const User = require("../models/User.js")



const findUserById = async(userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found", userId);
        }
        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
}



module.exports = {findUserById};