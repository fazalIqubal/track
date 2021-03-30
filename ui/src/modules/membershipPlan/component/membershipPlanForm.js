import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, InputNumber } from 'antd';
import * as dropdowns from '../../../helpers/dropdowns'
import { setEditMembershipPlan } from '../action/membershipPlan.actions'
import _ from 'lodash';

class MembershipPlanForm extends React.Component {
    formRef = React.createRef();
    constructor() {
        super();
        this.state = {
            disabled: false,
            validateMessages: {
                required: '${label} is required!',
                types: {
                  email: '${label} is not validate email!',
                  number: '${label} is not a validate number!',
                  string: '${label} is not a validate!'
                },
                number: {
                  range: '${label} must be between ${min} and ${max}',
                },
                string: {
                    range: '${label} must be between ${min} and ${max}'
                }
              }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { editedMembershipPlanList } = this.props
        if (_.isEmpty(editedMembershipPlanList)) {
            this.formRef.current.resetFields();
        }
        this.formRef.current.setFieldsValue(editedMembershipPlanList);
    }
    onChangeOptions = (name, value) => {
        const { dispatch, editedMembershipPlanList } = this.props
        const membershipPlan = Object.assign({}, editedMembershipPlanList)
        membershipPlan[name] = value;
        dispatch(setEditMembershipPlan(membershipPlan))
    }
    handleChange = (e, type, name) => {
        const { dispatch, editedMembershipPlanList } = this.props
        const membershipPlan = Object.assign({}, editedMembershipPlanList)
        var name, value;
        if(type == 'number' && name){
            name = name;
            value = e;
        }else{
            name = e.target.name;
            value = e.target.value;
        }
        membershipPlan[name] = value;
        dispatch(setEditMembershipPlan(membershipPlan))
    }

    render() {
        const { Option } = Select;
        const { editedMembershipPlanList } = this.props
        return (
            <Form
                layout="vertical"
                ref={this.formRef}
                id='membershipPlanForm'
                validateMessages={this.state.validateMessages}
            >
                <Form.Item
                    className="membershipPlan_name"
                    label="Membership Plan Name"
                    name="name"
                    rules={[{ required: true}, { type: 'string', min: 3, max:30}]}
                >
                    <Input
                        onChange={(e) => this.handleChange(e)}
                        id='membershipPlan_name'
                        name="name"
                        type="text"
                        value = {editedMembershipPlanList.name}
                    />
                </Form.Item>
                <Form.Item
                    className="description"
                    label="Description"
                    name="description"
                    rules={[{ required: true}, { type: 'string', min: 3, max:500}]}
                >
                    <Input
                        name="description"
                        type="text"
                        id='description'
                        onChange={(e) => this.handleChange(e)}
                        value = {editedMembershipPlanList.description}
                    />
                </Form.Item>
                <Form.Item
                    className="price"
                    label="Price"
                    name="price"
                    rules={[{ required: true},{ type: 'number', min: 1}]}
                >
                    <InputNumber 
                        className = "numberInput"
                        name="price"
                        type="number"
                        id='price'
                        value = {editedMembershipPlanList.price}
                        onChange={(e) => this.handleChange(e, "number", "price")}
                       
                    />
                </Form.Item>
                <Form.Item
                    className="project_limit"
                    label="Project Limit"
                    name="project_limit"
                    rules={[{ required: true}, { type: 'number', min: 1}]}
                >
                    <InputNumber
                        className = "numberInput"
                        name="project_limit"
                        type="number"
                        id='project_limit'
                        value = {editedMembershipPlanList.project_limit}
                        onChange={(e) => this.handleChange(e, "number", "project_limit")}
                    />
                </Form.Item>
                <Form.Item
                    className="user_limit"
                    label="User Limit"
                    name="user_limit"
                    rules={[{ required: true},{ type: 'number', min: 1}]}
                >
                    <InputNumber
                        className = "numberInput"
                        name="user_limit"
                        type="number"
                        id='user_limit'
                        value = {editedMembershipPlanList.user_limit}
                        onChange={(e) => this.handleChange(e, "number", "user_limit")}
                    />
                </Form.Item>
                <Form.Item
                    className="plan_duration"
                    label="Plan Duration"
                    name="plan_duration"
                    rules={[{ required: true}]}

                >
                    <Select
                        placeholder="Select Your Plan"
                        onChange={(value) => this.onChangeOptions('plan_duration', value)}
                        name='plan_duration'
                        id='plan_duration'
                        value = {editedMembershipPlanList.plan_duration}
                    >
                        {
                            dropdowns.planDuration.map((plan, index) => {
                                return <Option key={index} value={plan.value}>{plan.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}
function mapStateToProps(state) {
    const { user } = state.authentication;
    const { editedMembershipPlanList } = state.membershipPlan;
    return {
        user, editedMembershipPlanList
    }
}
export default connect(mapStateToProps)(MembershipPlanForm)