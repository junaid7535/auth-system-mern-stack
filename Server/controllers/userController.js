import userModel from "../models/userModel.js";

export const getUserData = async (req,res) => {
    const userId = req.userId

    const user = await userModel.findById(userId);

    if(!user){
        return res.status(404).json({
            success : false,
            message : 'user not found'
        })
    }
    return res.json({
        success : true,
        userData : {
            name : user.name,
            isAccountVerified : user.isAccountVerified 
        }
    })
}


export const getData = async(req,res) => {
    const data = await userModel.find({});

    
    return res.json({
        success : true,
        data : data
    })
    
}
