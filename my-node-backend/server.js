const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const qs = require('qs')

app.use(cors())
app.use(express.json())

// this code for getting the access token
app.post('/api/token', async(req, res) => { // tbhis line get the data from correct endpoint
    const accessTokenParams = {
        code: req.body.code,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        grant_type: req.body.grant_type
    }

    try {
        const response = await axios.post('https://accounts.zoho.in/oauth/v2/token',
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
        const response = await axios.post('https://accounts.zoho.in/oauth/v2/token',
                qs.stringify(accessTokenParams),// zoho must want the params in url encoded type.so that's why we send it in qs (qs is a liabrary)
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )

        const getingUserDetail = await axios.get('https://meeting.zoho.in/api/v2/user.json', // extra post request for get the user account deatil
                {
                    headers : {
                        'Authorization':`Zoho-oauthtoken ${await response.data.access_token}` 
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
app.post('/api/create', async(req, res) => {
    const session = req.body // this is session credencial
    const {extras} = req.query  // this is for get the extra information like zsoid and access token
        try {
            const response = await fetch(
                `https://meeting.zoho.in/api/v2/${extras.zsoid}/sessions.json`,
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

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
