const mongoose = require("mongoose");
const sampleData = require("./data")
const Listing = require("../models/listing");


main().then(() => {
    console.log("Connected Successful");
}).catch((err) => {
    console.log(err)
})


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
   await Listing.deleteMany({})
   sampleData.data = sampleData.data.map((obj) =>({
    ...obj , owner: "65981777e2cecba0848973b1"
 }))
   await Listing.insertMany(sampleData.data)
   console.log("Hello")
}
initDB();