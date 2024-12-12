const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://mockCRM:infiinfo01@crm2.74ass.mongodb.net/?retryWrites=true&w=majority&appName=crm2`
const client = new MongoClient(uri);
const database = client.db('crm')

// export const getDataFromDB = async (collectionName) => {
//     const collection = database?.collection(collectionName)

//     const data = await collection.find({}).toArray()
//     data.then((responceData) => {
//         return responceData
//     })
// }

const getDataFromDB = async (collectionName) => {
    const collection = database?.collection(collectionName)
    const data = await collection.find({}).toArray()
    return data
};

module.exports = { getDataFromDB }