import axios from 'axios';
import React from 'react';
//import { Redirect } from 'react-router-dom';//
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  notification
} from 'antd';
import './register.css';

import {
  crypto_md5
} from '../util/crypto_util';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleSwitchBox = () => {
    this.props.switchBox('login');
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.password = values.confirm = crypto_md5(values.confirm);

        axios.post('/register', values).then((res) => {
          if (res.data.error == 0) {
            notification['success']({
              message: '注册成功',
              description: '恭喜你成功鲲鹏的一员，请前往登录.',
            });

            this.handleSwitchBox();
          } else {
            notification['error']({
              message: '注册失败',
              description: res.data.error,
            });

            console.log(res);
          }
        }).catch(err => {
          notification['error']({
            message: '注册失败',
            description: '系统错误.',
          });

          console.log(err);
        });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {
        force: true
      });
    }

    callback();
  }

  render() {
    const {
      getFieldDecorator
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        },
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 4,
        },
      },
    };

    return ( <
      Form onSubmit = {
        this.handleSubmit
      } >
      <
      FormItem { ...formItemLayout
      }
      label = "邮箱" > {
        getFieldDecorator('email', {
          rules: [{
            type: 'email',
            message: '邮箱格式不正确!',
          }, {
            required: true,
            message: '请输入邮箱!',
          }],
        })( <
          Input / >
        )
      } <
      /FormItem> <
      FormItem { ...formItemLayout
      }
      label = "密码" > {
        getFieldDecorator('password', {
          rules: [{
            required: true,
            message: '请输入密码!',
          }, {
            validator: this.validateToNextPassword,
          }],
        })( <
          Input type = "password" / >
        )
      } <
      /FormItem> <
      FormItem { ...formItemLayout
      }
      label = "确认密码" > {
        getFieldDecorator('confirm', {
          rules: [{
            required: true,
            message: '请确认密码!',
          }, {
            validator: this.compareToFirstPassword,
          }],
        })( <
          Input type = "password"
          onBlur = {
            this.handleConfirmBlur
          }
          />
        )
      } <
      /FormItem> <
      FormItem { ...tailFormItemLayout
      } > {
        getFieldDecorator('agreement', {
          //valuePropName: 'checked',
          rules: [{
            required: true,
            message: '不同意协议将无法注册',
          }]
        })( <
          Checkbox > 我同意 < a href = "javascript:void(0);" > 鲲鹏协议 < /a></Checkbox >
        )
      } <
      /FormItem> <
      FormItem >
      <
      Button type = "primary"
      htmlType = "submit"
      className = "register-form-button" > 注册 < /Button> <
      span className = "tips-login" > 已有账号？ < a href = "javascript:void(0);"
      onClick = {
        this.handleSwitchBox
      } > 登录! < /a></span >
      <
      /FormItem> < /
      Form >
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

class KunPengRegisterForm extends React.Component {
  render() {
    return ( <
      div className = "register-box" >
      <
      span className = "register-title" > 鲲鹏 < /span> <
      span className = "register-proverbs" > 注册鲲鹏， 在自由的天空展翅翱翔 < /span> <
      WrappedRegistrationForm switchBox = {
        this.props.switchBox
      }
      /> < /
      div >
    );
  }
}

export {
  KunPengRegisterForm
};