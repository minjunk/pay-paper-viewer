import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/components/reset.min.css';
import 'semantic-ui-css/components/site.min.css';
import 'semantic-ui-css/components/menu.min.css';
import 'semantic-ui-css/components/segment.min.css';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/button.min.css';
import 'semantic-ui-css/components/checkbox.min.css';
import 'semantic-ui-css/components/message.min.css';
import './index.css';

import OpenFileApp from './containers/OpenFileApp';

ReactDOM.render(<OpenFileApp />, document.getElementById('root'));
