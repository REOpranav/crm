const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const qs = require('qs')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { theme } = require('antd')
require('dotenv').config()

app.use(express.json()) // Parse incoming JSON
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
  });

let a = process.env.MONGODB_PASSWORD
const uri = `mongodb+srv://vadivel:${process.env.MONGODB_PASSWORD}@crmcluster1.weqo4.mongodb.net/?retryWrites=true&w=majority&appName=CRMcluster1`

// Create an API route to serve the data
app.get('/api/contacts', async (req, res) => {
    try {
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        const dataBase = client.db('CRMdata')
        const collection = dataBase.collection('contact')

        // getting data from mongo DB
        const data = collection.find({}).toArray()
        data.then((responceData) => {
            res.json(responceData)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

// this all are meeting intergration code
// this code for getting the access token
app.post('/api/token', async (req, res) => { // tbhis line get the data from correct endpoint
    const accessTokenParams = {
        code: req.body.code,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        grant_type: req.body.grant_type
    }
    try {
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token',
            // zoho must want the params in url encoded type.so that's why we send it in qs (qs is a liabrary)
            qs.stringify(accessTokenParams),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        res.json(response.data)
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            message: error.message,
            error: error.response ? error.response.data : null
        });
    }
})

//  this code for get the user (accounter) detail
app.post('/api/userdetail', async (req, res) => {
    const accessTokenParams = {
        code: req.body.code,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        grant_type: req.body.grant_type
    }
    try {
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token',
            qs.stringify(accessTokenParams),// zoho must want the params in url encoded type.so that's why we send it in qs (qs is a liabrary)
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        const getingUserDetail = await axios.get('https://meeting.zoho.com/api/v2/user.json', // extra post request for get the user account deatil
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${response.data.access_token}`
                }
            })
        res.json(getingUserDetail.data)
        return

    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            message: error.message,
            error: error.response ? error.response.data : null
        });
    }
})

// this post for create a meeting
app.post('/api/create', async (req, res) => {
    const session = req.body // this is session credencial
    const { extras } = req.query  // this is for get the extra information like zsoid and access token
    try {
        const response = await fetch(
            `https://meeting.zoho.com/api/v2/${extras.zsoid}/sessions.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${extras.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(session),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to create meeting: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to create meeting", error: error.message });
    }
}
)

// this is for deleting the meeting
app.post('/api/meeting/delete', async (req, res) => {
    const { session } = await req.body
    try {
        let URL = `https://meeting.zoho.com/api/v2/${await session.zsoid}/sessions/${await session.meetingKey}.json`

        const deleteMeeting = await fetch(
            URL,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${session.accessToken}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(session),
            }
        )
        const data = await deleteMeeting.json();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to delete meeting", error: error.message });
    }
})

// this is for listing the Current ZOHO meetings
app.post('/api/list', async (req, res) => {
    const { session } = await req.body
    try {
        let URL = `https://meeting.zoho.com/api/v2/${await session.zsoid}/sessions.json`
        const listMeeting = await fetch(
            URL,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${session.access_token}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            }
        )
        const data = await listMeeting.json();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to list meeting", error: error.message });
    }
})

// this is for editing the meeting
app.post('/api/edit', async (req, res) => {
    const { session } = await req.body
    const { extras } = req.query
    try {
        let URL = `https://meeting.zoho.com/api/v2/${await extras.zsoid}/sessions/${await extras.meetingKey}.json`
        const editMeeting = await fetch(
            URL,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Zoho-oauthtoken ${await extras.access_token}`,
                },
                body: JSON.stringify({ session }),
            }
        )
        const data = await editMeeting.json();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to list meeting", error: error.message });
    }
})


// below code is mail intergration
app.post('/api/mailAccountToken', async (req, res) => {  //  this code for get the user (accounter) detail
    const accessTokenParams = {
        code: req.body.code,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        grant_type: req.body.grant_type
    }

    try {
        const getZOHOmeetingAccessToken = await axios.post('https://accounts.zoho.com/oauth/v2/token',
            qs.stringify(accessTokenParams),// zoho must want the params in url encoded type.so that's why we send it in qs (qs is a liabrary)
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )

        const fecthingZOHOmeetingAccountDetails = await axios.get('https://mail.zoho.com/api/accounts', // extra post request for get the user account deatil
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${await getZOHOmeetingAccessToken?.data?.access_token}`
                }
            })

        const getTokensAndFetchedAccountDetail = {
            getZOHOmeetingAccessToken: getZOHOmeetingAccessToken?.data,
            fecthingZOHOmeetingAccountDetails: fecthingZOHOmeetingAccountDetails?.data?.data
        }
        res.json(getTokensAndFetchedAccountDetail)
        return
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            message: error.message,
            error: error.response ? error.response.data : null
        });
    }
})

//  this code for get the user (Folder ID) detail
app.post('/api/mailFolder', async (req, res) => {
    let ZOHOmailAccountID = req.body.ZOHOmailAccountID
    const accessTokenParams = {
        code: req.body.code,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        grant_type: req.body.grant_type
    }

    try {
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token',
            qs.stringify(accessTokenParams),// zoho must want the params in url encoded type.so that's why we send it in qs (qs is a liabrary)
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        const getFolderDetail = await axios.get(`https://mail.zoho.com/api/accounts/${ZOHOmailAccountID}/folders`, // extra post request for get the user account deatil
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${await response?.data?.access_token}`
                }
            })

        const getTokensAndFolderDetail = {
            getZOHOfolderAccessToken: response?.data,
            getZOHOfolderDetails: getFolderDetail?.data?.data
        }
        res.json(getTokensAndFolderDetail)
        return
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            message: error.message,
            error: error.response ? error.response.data : null
        });
    }
})

//  this code for get the user (getZOHOmailMessageAccessToken) detail
app.post('/api/ZOHOmailMessageAccessToken', async (req, res) => {
    const accessTokenParams = {
        code: req.body.code,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        grant_type: req.body.grant_type
    }
    try {
        const getZOHOmailMessageAccessToken = await axios.post('https://accounts.zoho.com/oauth/v2/token',
            qs.stringify(accessTokenParams),// zoho must want the params in url encoded type.so that's why we send it in qs (qs is a liabrary)
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        res.json(getZOHOmailMessageAccessToken.data)
    } catch (error) {
        console.log(error)
        res.status(error.response ? error.response.status : 500).json({
            message: error.message,
            error: error.response ? error.response.data : null
        })
    }
})

// this is for listing the Current ZOHO meetings
app.post('/api/mailList', async (req, res) => {
    const { session } = await req.body
    const mailAccessToken = session?.mailAccess_token

    try {
        let URI = `https://mail.zoho.com/api/accounts/${session.mailAccountID}/messages/view?folderId=${session.mailFolderID}&start=1&limit=200`
        const listMeeting = await fetch(URI,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${mailAccessToken}`,
                },
            }
        )
        const data = await listMeeting.json()
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to list meeting", error: error.message });
    }
})

// this is for deleting the ZOHO 
app.post('/api/maildelete', async (req, res) => {
    const { session } = await req.body
    const mailAccessToken = session?.mailAccess_token

    try {
        let URL = `https://mail.zoho.com/api/accounts/${session?.mailAccountID}/folders/${session?.mailFolderID}/messages/${session?.deletingMailFolder_ID}`
        const deleteMail = await fetch(
            URL,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${mailAccessToken}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json'
                },
            }
        )
        const data = await deleteMail.json();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to delete meeting", error: error.message });
    }
})

// this post for send the mail
app.post('/api/sendMail', async (req, res) => {
    const session = req.body // this is session credencial
    const { extras } = req.query  // this is for get the extra information like zsoid and access token 
    try {
        const response = await fetch(
            `https://mail.zoho.com/api/accounts/${extras.accountId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${extras.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(session.details),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to create meeting: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to send Mail", error: error.message });
    }
})

// this is for showing the individual mail(ZOHO) data  
app.post('/api/mailDataIndividual', async (req, res) => {
    const { session } = await req.body
    const mailAccessToken = session?.mailAccess_token

    try {
        let URLs = [
            `https://mail.zoho.com/api/accounts/${session?.mailAccountID}/folders/${session?.mailFolderID}/messages/${session?.showZOHOMailMessage}/details`,
            `https://mail.zoho.com/api/accounts/${session?.mailAccountID}/folders/${session?.mailFolderID}/messages/${session?.showZOHOMailMessage}/content`
        ]

        const responce = await Promise.all(URLs.map(async (url) => {
            const fetching = await fetch(
                url,
                {
                    method: 'GET',
                    headers: {
                        "Accept": `application/json`,
                        "Content-Type": "application/json",
                        "Authorization": `Zoho-oauthtoken ${mailAccessToken}`
                    }
                }
            )
            if (!fetching.ok) {
                throw new Error(`Failed to access individual mail`)
            }
            return fetching.json();
        }))

        const [detail, content] = responce

        res.json({ detail, content })
    } catch (error) {
        console.log(error);
        // res.status(500).json({ message: "Failed to delete meeting", error: error.message });
    }
})

// this post for reply the mail
app.post('/api/mailDataIndividualReply', async (req, res) => {
    const session = req.body // this is session credencial
    const { extras } = req.query  // this is for get the extra information like zsoid and access token 

    try {
        const response = await fetch(
            `https://mail.zoho.com/api/accounts/${extras?.accountId}/messages/${extras?.messageId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${extras?.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(session?.details),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to create meeting: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: "Failed to send Mail", error: error.message });
    }
})

// running the node in 3002 port
const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});