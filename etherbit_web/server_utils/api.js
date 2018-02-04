var axios = require('axios');
var mongojs = require('mongojs');
var db = mongojs('etherbit', ['currencies']);
var io= require('socket.io-client');



var currencyFetcher = function (req, res, next) {
	  var coinCapFront= 'https://coincap.io/front';
	  var count=0;
	  axios.get(coinCapFront)
	  .then(function (response) {
	  	db.currencies.runCommand('count', function (err, res) {
			var coin_arr=JSON.parse(JSON.stringify(response.data));
			
			if(res.n == coin_arr.length){ 
				console.log('data already present');		   
			}else{
				db.currencies.remove({});
				console.log("local data removed");
				coin_arr.forEach(function(item){
					item.image_url= "http://coincap.io/images/coins/"+item.long.replace(/ /g,'')+".png";	
				});
				db.currencies.insert(coin_arr);
		    	console.log('local data updated sucessfully');
			}
		})
	  	
	  
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
	  next();
	}


var updatecoin = function(tradeMsg){
	response= JSON.parse(JSON.stringify(tradeMsg));
    var coin = response.coin;
    var msg=JSON.parse(JSON.stringify(response.msg));
    db.currencies.update({short: coin}, 
    	{$set:{	
    		cap24hrChange:msg.cap24hrChange,
			long:msg.long,
			short:msg.short,
			perc:msg.perc,
			price:msg.price,
			mktcap:msg.mktcap,
			shapeshift:msg.shapeshift,
			supply:msg.supply,
			usdVolume:msg.usdVolume,
			volume:msg.volume,
			vwapData:msg.vwapData,
			vwapDataBTC:msg.vwapDataBTC}} , function () {
							
				});
}

module.exports= {
	currencyFetcher : currencyFetcher,
	updatecoin:updatecoin
}