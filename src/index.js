'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { WrappedNormalLoginForm } from './compoents/login';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import moment from 'moment';
// import 'moment/locale/zh-cn';
// 
// moment.locale('zh-cn');

ReactDOM.render(<WrappedNormalLoginForm />, document.getElementById('root'));
