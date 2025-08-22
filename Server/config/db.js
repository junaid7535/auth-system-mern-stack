import mongoose from "mongoose";

const databaseConnection = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log('database connected successfully')
    }
    catch(e){
        
    }
}

export default databaseConnection;