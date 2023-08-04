import mongoose,{ConnectOptions} from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URL: string= process.env.MONGO_URL || "mongodb://localhost:27017/expense-tracker";

const options={
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions;

const connectDB=()=>{
    mongoose.connect(`${MONGO_URL}/transactions`,options).then(()=>{
        console.log("Connected to MongoDB");
        
    }).catch((error)=>{
        console.log("Error connecting to MongoDB");
        console.log(error);
    })
}

export default connectDB;