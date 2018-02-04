/*
*	HackPoly 2018 Feb 3-4
*	Hamza Parekh & Michael Wono
*/
// rethinkdb is running on port 28015 default
var r = require('rethinkdbdash')({db: 'HackPoly'}); // r is linked to database
const express = require('express');// exp is linked to express(web framework for node.js)
const bodyParser = require('body-parser'); // parses through body to extract info
const app = express(); // instance of express
app.use(bodyParser.json()); // parse through json body file and get info

//app.get('/', (req, res) => res.send('Hello World!'))// request from frontend and response from backend
//app.listen(3000, () => console.log('Example app listening on port 3000!'))

// app.(commands below) is from express
// get (Handling requests to Get data from db from outside source) can't read body of input request
// post (Handling requests to Send data to db from outside source)
// put ()
// delete ()

/********************************************************************************************************/

// handle create profile requests
app.post('/users', function(req, res) {
	// req = request | body = body of request | then .(whatever Frontend fields are called)
	r.table('Users').insert({ // insert into Users table
		email: req.body.email,
		password: req.body.password,
		name: req.body.name, 
		social: req.body.social,
		location: req.body.location, 
		skills: req.body.skills
	})
	.then(data => {// get some response from db
		console.log(data); // info received from db after entering info
		// wait for data then send back
		res.send({success: true, id: data.generated_keys[0]}); // send unique ID
	})
	.catch(console.error); // catch error and send message to console
});

// handle post(frontend posts search data and we send results back) requests for search
app.post('/search', function (req, res) {
	console.log(req.body);
	r.table('Users').filter(r.row('skills').downcase().match(req.body.searchTerm.toLowerCase())) // lowerCase input and search 'skills' row for input
	.then(data => {
		console.log(data); // send data to console to verify
		res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

// Create request to add connection from search
app.post('/connections', function (req, res) {
	r.table('Connections').insert({ // insert into Connections table
		sender: req.body.sender,
		receiver: req.body.receiver,
		status: 'pending'
	})
	.then(data => {
		console.log(data); // send data to console to verify
		res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

/**********************************************************************************************************/
// Untested with Michael

// Pending connections for sender to see under "Sent Requests": will happen periodically
app.post('/pending', function (req, res) {
	//r.db('HackPoly').table('Connections').getAll(req.body.sender, { index: 'sender' }) // get all connections from which the sender is the curr user
	r.db('HackPoly').table('Connections').filter(
  		r.row('sender').eq(req.body.sender).and(r.row('status').eq('pending'))
	)
	.then(data => {
		console.log(data); // send data to console to verify
		res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

// Request connections for receiver to accept or decline "Received Requests": will happen periodically
app.post('/requests', function (req, res) {
	r.db('HackPoly').table('Connections').filter(
  		r.row('sender').eq(req.body.receiver).and(r.row('status').eq('pending')) //????????????????????????????????????
	)
	.then(data => {
		console.log(data); // send data to console to verify
		res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

// Accept request
app.post('/accept', function (req, res) {
	r.db('HackPoly').table('Connections').filter(
  		r.row('sender').eq(req.body.receiver).and(r.row('status').eq('pending')) //????????????????????????????????????
	).update({status: "accepted"})
	.then(data => {
		console.log(data); // send data to console to verify
		res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

// Decline request
app.post('/decline', function (req, res) {
	r.db('HackPoly').table('Connections').filter(
  		r.row('sender').eq(req.body.receiver).and(r.row('status').eq('pending')) //????????????????????????????????????
	).update({status: "decline"})
	.then(data => {
		console.log(data); // send data to console to verify
		res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

// Current connections for sender to see under "Current Connections": will happen periodically
app.post('/current', function (req, res) {
	r.db('HackPoly').table('Connections').filter(
  		r.row('sender').eq(req.body.sender).and(r.row('status').eq('accepted'))
	)
	.then(data => {
		console.log(data); // send data to console to verify
		res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

// Logon and send Key
app.post('/logon', function (req, res) {
	r.db('HackPoly').table('Users').filter(
  		r.row('email').eq(req.body.email).and(r.row('password').eq(req.body.password)) //????????????????????????????????????
	)
	.then(data => {
		console.log(data); // send data to console to verify
		res.send({success: true, id: data.generated_keys[0]}); // send unique ID
		//res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

// Update Profile
app.post('/update', function (req, res) {
	r.db('HackPoly').table('Users').filter(
  		r.row('id').eq(req.body.id)
	).update({status: "accepted",
				social: req.body.social,
				location: req.body.location, 
				skills: req.body.skills
			})
	.then(data => {
		console.log(data); // send data to console to verify
		res.send({success: true, id: data.generated_keys[0]}); // send unique ID
		//res.send(data); // send data back to frontend
	})
	.catch(console.error);
});

app.listen(3000, () => console.log('App listening on port 3000!'));