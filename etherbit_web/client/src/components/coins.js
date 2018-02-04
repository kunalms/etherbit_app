import React, { Component } from 'react';
import './coins.css';
import axios from 'axios';




class Coins extends Component {
  constructor() {
    super();
    this.state = {
      coins:[],
    }
    axios.get('/api/front?number=100')
      .then(function (response) {
        console.log(response.data.length)
        this.setState({coins:response.data});
      }.bind(this));

    this.openSocket = this.openSocket.bind(this);
    this.updateCoinInfo = this.updateCoinInfo.bind(this);
    this.openSocket();
    console.log(this.state.coins.length);
    }

  openSocket(){      
      console.log("socket initilized");
      var socket = require('socket.io-client')('http://localhost:8000');
      socket.on('feed', function (data) {
      this.updateCoinInfo(data);
    }.bind(this));
  }


  updateCoinInfo(tradeMsg){
    var response= JSON.parse(JSON.stringify(tradeMsg));
    var coin = response.coin;
    var msg=JSON.parse(JSON.stringify(response.msg));
    var coinArr= this.state.coins;
    console.log(coinArr.length);
    var index = coinArr.findIndex(x => x.short===coin);
    if(index != -1){
      msg.image_url= coinArr[index].image_url;
      coinArr[index]=msg;
      //console.log("before"+this.state.coins[index]);
      this.setState({coins:coinArr});
      //console.log("after"+this.state.coins[index]);
    }
  }

  render() {
    return (
      <div>
        <div className="container">
        <div className="table-hover">
        <table className="table">
          <thead>
            <tr>
              <th>Name </th>
              <th>Symbol</th>
              <th>Price </th>
              <th>$24 hr</th>
              <th>Market Cap </th>
              <th>24hour VWAP</th>
              <th>Availabe supply </th>
              <th>24hour Volume</th>

            </tr>
          </thead>
          <tbody>
          {this.state.coins.map(coin=>
            <tr key={coin.short} >
              <td > <img src={coin.image_url} alt="logo" height="42" width="42"/> {coin.long}</td>
              <td >{coin.short}</td>
              <td >{coin.price}</td>
              <td className={coin.perc>0?"postive":"negative"}>{coin.perc}</td>
              <td>{coin.mktcap} </td>
              <td>{coin.vwapData}</td>
              <td>{coin.supply} </td>
              <td>{coin.volume}</td>

            </tr>)}
          </tbody>
        </table>
        </div>
        </div>
      </div>
    );
  }
}

export default Coins;
