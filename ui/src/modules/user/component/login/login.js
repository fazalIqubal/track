import React, { Component } from 'react';
import { connect } from 'react-redux';
import './login.scss';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import googleLogo from '../../../../image/googleLogo.svg';
import microsoftLogo from '../../../../image/microsoftLogo.svg';
import logo from '../../../../image/logo1.png';
import banner1 from '../../../../image/banner1.png';
import banner2 from '../../../../image/banner2.png';
import { history } from '../../../../helpers';
import {login,logout} from '../../action/user.actions'


export class Login extends Component {
	formRef = React.createRef()
	constructor(props) {
		super(props);
		this.state = {
			formSubmit: false,
			user: {}
		}
	}

	componentDidMount() {
		localStorage.clear();
		localStorage.removeItem('user');
	}

	handleChange = (e) => {

		const user = Object.assign({}, this.state.user)
		const name = e.target.name;
		const value = e.target.value;
		user[name] = value;
		this.setState({ user: user });
	}

	goToResetPassword = () => {
		history.push('/resetPassword')
	}

	handleSubmit = (e) => {
		
		e.preventDefault();
		const { user } = this.state;
		const { dispatch } = this.props;
		if (user && user.username && user.password){
			dispatch(login(user))
			.then((res) => {
				if (res.access_token) {
					if(res.email_verified) {
						history.push('/dashboard')	
					} else {
						history.push('/userNewPassword')
					}
				}
				else{
					user.password =''
					this.setState({user:user})
					this.formRef.current.setFieldsValue({password : this.state.user.password} )

				}
			});
		}
	}

	render() {
		return (
			<div className='login-container'>
				<div className='banner-container'>
					<img className='left-banner' src={banner1} />
					<img className='right-banner' src={banner2} />
				</div>
				<div className='app-logo'>
					<img src={logo} />
				</div>
				<Form
					name="normal_login"
					className="login-form"
					initialValues={{
						remember: false,
					}}
					onSubmitCapture={(e) => this.handleSubmit(e)}
					ref = {this.formRef}
				>
					<h6 className='login-text'>Log in to your account</h6>
					<Form.Item
						name="username"
						rules={[
							{
								required: true,
								message: 'Please input your Username!',
							},
						]}

					>
						<Input
							prefix={<UserOutlined className="site-form-item-icon" />}
							name="username"
							placeholder="Username"
							onChange={(e) => this.handleChange(e)}
							id='name'
							value={this.state.user.username}
						/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: 'Please input your Password!',
							},
						]}
						id='passErr'

					>
						<Input
							prefix={<LockOutlined className="site-form-item-icon" />}
							name="password"
							type="password"
							placeholder="Password"
							onChange={(e) => this.handleChange(e)}
							id='password'
							value={this.state.user.password}
						/>
					</Form.Item>
					<Form.Item>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox id='rememberMe'>Remember me</Checkbox>
						</Form.Item>

						<a className="login-form-forgot" href="" id='forgotPassword'>
							Forgot password?
						</a>
					</Form.Item>

					<Form.Item className='singIn-btn'>
						<Button type="primary" htmlType="submit" className="login-form-button" id='signIn'>
							Sign in
						</Button>
					</Form.Item>
					<Form.Item>
						<span className='register' id='register'>
							<span>Don't have an account yet?</span><span><a href=""> Register now</a></span>
						</span>
					</Form.Item>
				</Form>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { user } = state.authentication;
	return {
		user,
	}
}
export default connect(mapStateToProps)(Login);