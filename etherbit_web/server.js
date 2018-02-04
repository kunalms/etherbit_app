const api = require('./server_utils/api');
const express = require ('express');
const mongojs = require ('mongojs');
const db = mongojs('etherbit', ['currencies']);

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.get ('/api/front',(req,res)=>{
		var number= parseInt(req.param("number"));
		console.log(number);
		var currencies=[];
		if(number!= 0){
			//console.log(true);
			db.currencies.find({}).limit(number).toArray(function (err, docs){
	    	if(docs.length!=0){
	    	 	docs.forEach(function(item){
	     	 		currencies.push(item);
	     	 	});
	    	}
	 		console.log(docs);
			res.json(currencies);
		});		
	}
	else{
	db.currencies.find(function (err, docs) {
		if(docs.length!=0){
    	docs.forEach(function(item){
        	currencies.push(item);
    	});
    	}
    	res.json(currencies);
	});
	}
});


io.on('connection', function (socket) {
	console.log("client connected");
	var coincap = require('socket.io-client')('https://coincap.io');
		coincap.on('trades', function (tradeMsg) {
			api.updatecoin(tradeMsg);
            socket.emit('feed',tradeMsg);
        });
    socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
});

io.listen(8000);

const port= 5000;
app.listen(port,()=> 
	console.log('server started on port', port));

