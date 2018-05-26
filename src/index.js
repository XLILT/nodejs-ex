'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { KunPengLoginReisterSwithcer } from './compoents/login-register-switcher';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import moment from 'moment';
// import 'moment/locale/zh-cn';
// 
// moment.locale('zh-cn');

ReactDOM.render(<KunPengLoginReisterSwithcer />, document.getElementById('root'));
