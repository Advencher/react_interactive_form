import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import "bulma/css/bulma.min.css";
import App from './App';
//import * as serviceWorker from './serviceWorker';
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
  document.getElementById('root'),
);


//serviceWorker.unregister();

if (module.hot) module.hot.accept();