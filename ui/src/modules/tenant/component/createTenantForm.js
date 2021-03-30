import React from 'react';
import { connect } from 'react-redux';
import {
    Button, Row, Col, Form, Input, Select
} from 'antd';
import * as dropdowns from '../../../helpers/dropdowns'
import { editTenant } from '../action/tenant.actions'
import _ from "lodash"


class CreateTenantForm extends React.Component {
    formRef = React.createRef();
    constructor() {
        super();
        this.state = {
            disabled: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { editedTenant } = this.props
        if (_.isEmpty(editedTenant)) {
            this.formRef.current.resetFields();
        }
        this.formRef.current.setFieldsValue(editedTenant);
    }

    onChangeOptions = (name, value) => {
        const { dispatch, editedTenant } = this.props
        const tenant = Object.assign({}, editedTenant)
        tenant[name] = value;
        dispatch(editTenant(tenant))
    }

    handleChange = (e) => {
        const { dispatch, editedTenant } = this.props
        const tenant = Object.assign({}, editedTenant)
        var name = e.target.name;
        var value = e.target.value;
        tenant[name] = value;
        dispatch(editTenant(tenant))
    }

    render() {
        const { Option } = Select
        return (
            <Form
                layout="vertical"
                ref={this.formRef}
                id='tenant-form'
            >
                <Form.Item
                    label="Tenant Name"
                    name="name"
                    id="name"
                    rules={[
                        {
                            required: true,
                            message: "Tenant's Name is required!",
                        },
                    ]}
                >
                    <Input
                        onChange={(e) => this.handleChange(e)}
                        id='name'
                        name="name"
                    />
                    
                </Form.Item>
                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                        {
                            type: "email",
                            message: "Email Address is not valid!",
                        },
                        {
                            required: true,
                            message: "Email Address is required!",
                        },
                    ]}
                >
                    <Input
                        name="email"
                        type="email"
                        onChange={(e) => this.handleChange(e)}
                        id='email'
                    />
                </Form.Item>
                <Form.Item
                    label="Company Name"
                    name="company_name"
                    rules={[
                        {
                            required: true,
                            message: "Company Name is required!",
                        },
                    ]}
                >
                    <Input
                        name="company_name"
                        type="text"
                        onChange={(e) => this.handleChange(e)}
                        id='company_name'
                    />
                </Form.Item>
                <Form.Item
                    label="Mobile"
                    name="mobile"
                    rules={[{ required: true, message: 'Mobile is required'}, {len:10, message:"Mobile must be of 10 digits"}]}
                >
                    <Input
                        name="mobile"
                        type="number"
                        onChange={(e) => this.handleChange(e)}
                        id='mobile'
                    />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[
                                {
                                    required: true,
                                    message: "Country is required!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select your country"
                                onChange={(value) => this.onChangeOptions('country', value)}
                                name='country'
                            >
                                {
                                    dropdowns.countries.map(country => {
                                        return <Option value={country.value}>{country.name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Language"
                            name="language"
                            rules={[
                                {
                                    required: true,
                                    message: "Language is required!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select your language"
                                onChange={(value) => this.onChangeOptions('language', value)}
                                name='language'
                            >
                                {
                                    dropdowns.language.map(language => {
                                        return <Option value={language.value}>{language.name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="Company Size"
                    name="company_size"
                    rules={[
                        {
                            required: true,
                            message: "Company Size is required!",
                        },
                    ]}

                >
                    <Select
                        placeholder="Select your company size"
                        onChange={(value) => this.onChangeOptions('company_size', value)}
                        name='company_size'
                    >
                        {
                            dropdowns.companySize.map(size => {
                                return <Option value={size.value}>{size.name}</Option>
                            })
                        }
                    </Select>
                    
                </Form.Item>
                <Form.Item
                    label="Primary Interest"
                    name="primary_interest"
                    rules={[
                        {
                            required: true,
                            message: "Primary Interest is required!",
                        },
                    ]}
                >
                    <Select
                        placeholder="What is your primary interest?"
                        onChange={(value) => this.onChangeOptions('primary_interest', value)}
                        name='primary_interest'
                    >
                        {
                            dropdowns.primaryInterest.map(interest => {
                                return <Option value={interest.value}>{interest.name}</Option>
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
    const { editedTenant, createdTenant } = state.tenant;
    return {
        user, editedTenant, createdTenant
    }
}
export default connect(mapStateToProps)(CreateTenantForm)