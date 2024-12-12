const { MongoClient } = require('mongodb');


const getDataFromDB = async (collectionName) => {
    const uri = `mongodb+srv://mockCRM:infiinfo01@crm2.74ass.mongodb.net/?retryWrites=true&w=majority&appName=crm2`
    const client = new MongoClient(uri);
    const database = client.db('crm')
    const collection = database?.collection(collectionName)    
    const data = collection.find({}).toArray()
    return data
};

module.exports = { getDataFromDB }