const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes } = require('crypto'); // generates random ID to the posts we create
const cors = require ('cors'); //needs cors because localhost port is diff (always require cors)
//url browser is diff from api: localhost:3000 compared to localhost:4000 here
const axios = require('axios');

const app = express();
app.use(bodyParser.json()); //whenever user sends .json data, parses the body
app.use(cors()); //needs cors

const posts = {}; //repository for every post we create

app.get('/posts', (req,res) =>{ //accepting the get request and does the get request
    res.send(posts); //get method sends back the posts repository AKA all the posts stored
});

app.post ('/posts',  async (req,res) => { //accepting the create post request and creates post
    const id = randomBytes(4).toString('hex'); //randombytes generates the random id assigned to the post
    const { title } = req.body; //whenever a req is sent, the body includes the title: string of the post

    posts[id] = { 
        id, title //put in repository at index id the id and title
    };

     await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    }); 

    res.status(201).send(posts[id]); //sends back response to user the post that was just created
}); 

app.post('/events', (req, res) => { //event accepter
    console.log('Received Event', req.body.type);

    res.send({}); //sends back yea we received the event
});

app.listen(4000, () => {
    console.log('v55');
    console.log ('Listening on 4000');
});
