const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = []; //events repository

app.post('/events', (req, res) => { //receives event from axios ending in '/events'
    const event = req.body;
    
    events.push(event);
    //axios is the event sender 
      /*
      axios.post('http://localhost:4000/events', event); //posts
      axios.post('http://localhost:4001/events', event); //comments
      axios.post('http://localhost:4002/events', event); //query service
*/

    
   
  
    axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message);
  });
  
  
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", event).catch((err) => { //moderation
  console.log(err.message)
  });
      
   res.send({status: 'OK'});
});

app.get('/events', (req,res) =>{
  res.send(events); //sends all the events during which a microservice was down
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});

//event bus implementation to handle events by echoing back information
//received from one service