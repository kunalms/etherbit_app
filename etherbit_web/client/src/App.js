import React, { Component } from 'react';
import Coins from './components/coins';
import Header from './components/common/header';
import Footer from './components/common/footer';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Coins />
        <Footer />
      </div>
    );
  }
}

export default App;
