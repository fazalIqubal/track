import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from '../../helpers';
import './userNewPassword.scss'
import logo from '../../image/logo1.png'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { setUserNewPassword } from '../user/action/user.actions'
import { Toast } from '../../wrapperComponents/notificationToast/notificationToast'
class userNewPassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userPassword: {
				id: ''
			},
			error: ""
		}
	}

	handleChange = (e) => {
		const userPassword = Object.assign({}, this.state.userPassword)
		const name = e.target.name;
		const value = e.target.value;
		userPassword[name] = value;
		this.setState({ userPassword: userPassword });
	}

	getlocalData(userPassword) {
		var localData = JSON.parse(localStorage.getItem('user'))
		if (localData) {
			userPassword.id = localData.user_id
		}
	}

	localClear() {
		localStorage.clear();
		localStorage.removeItem('user');
	}

	handleSubmit = (e) => {

		e.preventDefault();
		const { userPassword } = this.state;
		const { dispatch } = this.props;
		this.getlocalData(userPassword)
		if (userPassword && userPassword.temp_password && userPassword.user_newpassword && (userPassword.user_newpassword.length >= 5) && userPassword.user_confirm_password) {
			if (userPassword.user_newpassword === userPassword.user_confirm_password) {
				dispatch(setUserNewPassword(userPassword))
					.then((res) => {
						if (res && res.statusCode == 201) {
							this.localClear()
						}
						history.push('/login')
					})
			}
		}
	}

	render() {
		const { userPassword } = this.state;
		return (
			<div className='login-container'>
				<div className='app-logo'>
					<img src={logo} />
				</div>
				<div className="passwordPage">
					<h6 className='login-text'>Please enter a new password for your account</h6>
					<Form
						onSubmitCapture={(e) => this.handleSubmit(e)}
					>
						<Form.Item
							name="temp_password"
							rules={[
								{
									required: true,
									message: 'Please input your temp password!',
								},
							]}
						>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								name="temp_password"
								type="password"
								placeholder="Old Password"
								onChange={(e) => this.handleChange(e)}
								id='temp_password'
								value={userPassword.temp_password}
							/>
						</Form.Item>
						<Form.Item
							name="user_newpassword"
							rules={[
								{
									required: true,
									message: 'Please input your New Password!',
								},
								{ min: 5, message: 'Password must be minimum 5 characters.' },
							]}
							id='passErr'
						>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								name="user_newpassword"
								type="password"
								placeholder="New Password"
								onChange={(e) => this.handleChange(e)}
								id='user_newpassword'
								value={userPassword.user_newpassword}
							/>
						</Form.Item>
						<Form.Item
							name="user_confirm_password"
							rules={[
								{
									required: true,
									message: 'Please input your Confirm Password!',
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || getFieldValue('user_newpassword') === value) {
											return Promise.resolve();
										}
										return Promise.reject("Password doesn't match!");
									},
								})
							]}
							id='passconfirmEr'
						>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								name="user_confirm_password"
								type="password"
								placeholder="Confirm Password"
								onChange={(e) => this.handleChange(e)}
								id='user_confirm_password'
								value={userPassword.user_confirm_password}
							/>
						</Form.Item>
						<Form.Item className='singIn-btn'>
							<Button type="primary" htmlType="submit" className="login-form-button" id='submit'>
								Submit
						</Button>
						</Form.Item>
					</Form>
				</div>
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
export default connect(mapStateToProps)(userNewPassword);