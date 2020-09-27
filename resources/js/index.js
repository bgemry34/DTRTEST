import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

if(document.getElementById('app'))
ReactDOM.render(
  <React.Fragment>
    <Main />
  </React.Fragment>,
  document.getElementById('app')
);