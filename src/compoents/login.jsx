import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './login.css';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSwitchBox = () => {    
    this.props.switchBox('register');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入账号!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password-login', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>记住账号</Checkbox>
          )}
          <a className="login-form-forgot" href="">忘记密码</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          <span className="tips-register" >没有账号？<a href="javascript:void(0);" onClick={this.handleSwitchBox}>注册!</a></span>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

class KunPengLoginForm extends React.Component {
  render() {
    return (
      <div className="login-box">
        <span className="login-title">鲲鹏</span>
        <span className="login-proverbs">登录鲲鹏，在自由的天空展翅翱翔</span>
        <WrappedNormalLoginForm switchBox={this.props.switchBox} />
      </div>
    );  
  }  
}

export { KunPengLoginForm };
