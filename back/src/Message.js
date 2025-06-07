import mongoose, {mongo} from "mongoose";
const messageSchema = mongoose.Schema({
    value: {type: String, required: true},
    sender: {type: String, required: true},
    receiver: {type: String, required: true},
    timeStamp: {type: Date, default: Date.now()},
})
export default mongoose.model('Message', messageSchema);