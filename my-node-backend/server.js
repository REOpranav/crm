const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const qs = require('qs')

app.use(cors())
app.use(express.json())

app.post('/api/token', async (req, res) => { // tbhis line get the data from correct endpoint
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

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
