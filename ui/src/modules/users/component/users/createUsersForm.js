import React from 'react';
import {Layout, Form, Input, InputNumber} from 'antd';
import { connect } from 'react-redux';
import {setEditUser} from '../../action/users.actions'
import _ from 'lodash';

class UsersForm extends React.Component{
    formRef = React.createRef();
    constructor(){
        super();
        this.state = {
            disabled: false,
            isEditing: false,
            validateMessages: { 
                required: '${label} is required!', 
                types: { 
                    email: '${label} is not validate email!', 
                    number: '${label} is a number', 
                    string: '${label} is not a validate!',
                },
                number: { 
                    range: '${label} must be between ${min} and ${max} the pattern should be', 
                }, 
                string: { 
                    range: '${label} must be between ${min} and ${max}' 
                }
            
            } 
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { editedUserData } = this.props
        if(_.isEmpty(editedUserData)){
            this.formRef.current.resetFields();
        }
        this.formRef.current.setFieldsValue(editedUserData);
    }

    handleChange = (e)=>{
        const{dispatch, editedUserData} =  this.props
        const user = Object.assign({}, editedUserData) 
        var name = e.target.name;
        var value = e.target.value;
        user[name] = value;
        dispatch(setEditUser(user))
    }

    render(){
        const { editedUserData } = this.props
        return(
            <Form 
                id = 'users-form'
                layout="vertical" 
                ref={this.formRef}
                validateMessages={this.state.validateMessages}
            >
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[{ required: true}, { type: 'string', min: 3, max:30}]}
                >
                    <Input 
                        onChange={(e) => this.handleChange(e)}
                        id='first_name'
                        name="first_name"
                        placeholder="Enter first name"
                        value = {editedUserData.first_name}
                    />
                </Form.Item>
                <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[{ required: true}, { type: 'string', min: 3, max:30}]}
                >
                    <Input 
                        onChange={(e) => this.handleChange(e)}
                        id='last_name'
                        name="last_name"
                        placeholder="Enter last name"
                        value = {editedUserData.last_name}
                    />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true}, { type: 'string', min: 3, max:30}]}
                >
                    <Input 
                        onChange={(e) => this.handleChange(e)}
                        id='address'
                        name="address"
                        placeholder="Enter address"
                        value = {editedUserData.address}
                    />
                </Form.Item>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true}, { type: 'string', min: 3, max:30}]}
                >
                    <Input 
                        onChange={(e) => this.handleChange(e)}
                        id='username'
                        name="username"
                        placeholder="Enter username"
                        value = {editedUserData.username}
                    />
                </Form.Item>
                <Form.Item
                    name="mobile"
                    label="Mobile"
                    rules={[{required: true},{max:10}, { pattern:/[2-9]{2}\d{8}/, message: "Please enter valid mobile number !" }]}
                >
                    <Input 
                        onChange={(e) => this.handleChange(e)}
                        id='mobile'
                        name="mobile"
                        placeholder='Enter mobile number'
                        value = {editedUserData.mobile}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true}, { type: 'email'}]}
                >
                    <Input 
                        onChange={(e) => this.handleChange(e)}
                        id='email'
                        name="email"
                        placeholder='Enter email'
                        value = {editedUserData.email}
                    />
                </Form.Item>
            </Form>         
        )
    }
}
function mapStateToProps(state) {  
    const { editedUserData} = state.users;
    return {
        editedUserData
    }
}
export default connect(mapStateToProps)(UsersForm);