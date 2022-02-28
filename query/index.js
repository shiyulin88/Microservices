const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};
//quick example of what this repository looks like, has a post with post title and an array of comments 
/* posts === {
    'j123214': {
        id: '',
        title: 'post title',
        comments: [
            { id: 'klsdf', content: 'comment'}
        ]
    },
    'j123214': {
        id: '',
        title: 'post title',
        comments: [
            { id: 'klsdf', content: 'comment'}
        ]
    }
} */
const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const {id, title} = data;

        posts[id] = {id,title, comments:[]};
    }

    if (type === 'CommentCreated'){
        const{id, content, postId, status} = data;

        const post = posts[postId];
        post.comments.push({id, content,status});
    }

    if (type == 'CommentUpdated') {
        const {id, content, postId, status} = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req,res) => {
    res.send(posts);
});

app.post('/events', (req,res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002');
    try {
        const res = await axios.get("http://localhost:4005/events"); //if query service goes down, axios event bus for all the events that it missed out on

        for (let event of res.data) {
          console.log("Processing event:", event.type);
     
          handleEvent(event.type, event.data);
        }
      } catch (error) {
        console.log(error.message);
      }
});
