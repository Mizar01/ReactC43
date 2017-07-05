import React from 'react';
import ReactDOM from 'react-dom';
import TFour from './tFour/TFour';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<TFour />, document.getElementById('root'));
registerServiceWorker();
