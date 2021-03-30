import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTenantList, addTenant, updateTenant, deleteTenant, editTenant } from '../action/tenant.actions'
import axios from 'axios';
import { TableComponent } from '../../../wrapperComponents/table/table'
import {
    Button, Row, Col, Form, Input, Select, Space, Menu, Dropdown, message, Alert
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { FormSlideout } from '../../../wrapperComponents/formSlideout/slideoutComponent'
import { emailRegex } from '../../../helpers/regex'
import './tenant.scss'
import CreateTenantForm from './createTenantForm'


class TenantsList extends Component {

    constructor() {
        super();
        this.state = {
            tenantsList: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    isFilters: true,
                    className: 'columnTitle',
                    width: 200,
                    ellipsis: true
                },
                {
                    title: 'Email Address',
                    dataIndex: 'email',
                    key: 'email',
                    isFilters: true,
                    className: 'columnTitle',
                    width: 250,
                    ellipsis: true
                },
                {
                    title: 'Company Name',
                    dataIndex: 'company_name',
                    key: 'company_name',
                    isFilters: true,
                    className: 'columnTitle',
                    width: 150,
                    ellipsis: true
                },
                {
                    title: 'Mobile',
                    dataIndex: 'mobile',
                    key: 'mobile',
                    isFilters: true,
                    className: 'columnTitle'
                },
                {
                    title: 'Country',
                    dataIndex: 'country',
                    key: 'country',
                    isFilters: true,
                    className: 'columnTitle'
                },
                {
                    title: 'Company Size',
                    dataIndex: 'company_size',
                    key: 'company_size',
                    isFilters: true,
                    className: 'columnTitle',
                },
                {
                    title: 'Created By',
                    dataIndex: 'created_by',
                    key: 'created_by',
                    isFilters: true,
                    className: 'columnTitle'
                },
                {
                    title: '',
                    key: 'action',
                    render: (text, record) => (
                        <Space size="middle">
                            <Dropdown overlay={
                                <Menu>
                                    <Menu.Item key="1" onClick={() => this.handleEdit(record)}>
                                        Edit
                                </Menu.Item>
                                    <Menu.Item key="2" onClick={() => this.handleDelete(record)}>
                                        Delete
                                </Menu.Item>
                                </Menu>
                            }>
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                    <EllipsisOutlined />
                                </a>
                            </Dropdown>
                        </Space>
                    ),
                    width: 50
                },
            ],
            createTenantFormvisible: false,
            editTenantFormvisible: false,
            tenant: {},
            isEdit: false,
        }
    }

    componentDidMount() {
        this.getTenantList()
    }

    handleDelete = (tenant) => {
        const { dispatch } = this.props;
        dispatch(deleteTenant(tenant.id))
    }

    handleEdit = (tenant) => {
        this.setState({ editTenantFormvisible: true, isEdit: true })
        const { dispatch } = this.props
        dispatch(editTenant(tenant))
    }

    getTenantList = () => {
        const { dispatch } = this.props;
        dispatch(fetchTenantList())
    }

    handleSubmit = () => {
        const { editedTenant, dispatch } = this.props
        if (editedTenant.name && editedTenant.company_name && editedTenant.mobile && (editedTenant.mobile).toString().length == 10 && editedTenant.email && emailRegex(editedTenant.email) && editedTenant.country && editedTenant.language && editedTenant.company_size) {
            dispatch(addTenant(editedTenant))
            .then(response =>{
                this.onClose()
            })
            .then(response =>{
                dispatch(editTenant({}))
            })
           
        }
    }
    handleEditSave = () => {
        const { editedTenant, dispatch } = this.props
        if (editedTenant.name && editedTenant.company_name && editedTenant.mobile && (editedTenant.mobile).toString().length == 10 && editedTenant.email && emailRegex(editedTenant.email) && editedTenant.country && editedTenant.language && editedTenant.company_size) {
            var id = editedTenant.id
            delete editedTenant.id
            delete editedTenant.created_by
            dispatch(updateTenant(editedTenant, id))
            .then(response =>{
                this.onClose()
            })
            .then(response =>{
                dispatch(editTenant({}))
            })
        }
    }

    addTenant = () => {
        const { dispatch } = this.props
        this.setState({ createTenantFormvisible: true, isEdit: false })
        dispatch(editTenant({}))

    }

    onClose = () => {
        const { dispatch } = this.props
        dispatch(editTenant({}))
        this.setState({ editTenantFormvisible: false, createTenantFormvisible: false })
    }

    render() {
        const { tenantsList } = this.state;
        const { tenantList } = this.props
        return (
            <div className='tenant-table-container'>
                <h3>Tenants</h3>
                <hr />
                <div className='table-wrapper'>
                    <Button type="primary" className='create-tenant-btn' onClick={() => this.addTenant()}>Create Tenant</Button>
                    <TableComponent
                        columns={tenantsList}
                        dataSource={tenantList.data}
                    />
                </div>
                <FormSlideout
                    title="Create New Tenant"
                    onClose={() => this.onClose()}
                    visible={this.state.createTenantFormvisible}
                    primaryBtnEvent={() => this.handleSubmit()}
                    primary_button_name='Save'
                    form='tenant-form'
                    formElement={
                        <CreateTenantForm isEdit={this.state.isEdit} />
                    }
                />
                <FormSlideout
                    title="Edit Tenant"
                    onClose={() => this.onClose()}
                    visible={this.state.editTenantFormvisible}
                    primaryBtnEvent={() => this.handleEditSave()}
                    primary_button_name='Save'
                    form='tenant-form'
                    formElement={
                        <CreateTenantForm isEdit={this.state.isEdit} />
                    }
                />
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { user } = state.authentication;
    const { tenantList, createdTenant, editedTenant } = state.tenant;
    return {
        user, tenantList, createdTenant, editedTenant
    }
}
export default connect(mapStateToProps)(TenantsList)