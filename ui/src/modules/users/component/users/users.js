import React, { Component } from 'react';
import { TableComponent } from '../../../../wrapperComponents/table/table'
import {FormSlideout} from '../../../../wrapperComponents/formSlideout/slideoutComponent';
import UsersForm from './createUsersForm'
import { connect } from 'react-redux';
import './users.scss';
import {  EllipsisOutlined } from '@ant-design/icons';
import { Button , Space, Menu, Dropdown,Input, Row, Col } from 'antd';
import { fetchUsersList, CreateUser, deleteUser, updateUser, setUser, setEditUser} from '../../action/users.actions'
import { emailRegex } from '../../../../helpers/regex'
import{ SearchOutlined } from '@ant-design/icons'
import RowActionDropdown from '../../../../wrapperComponents/rowActionDropDown/rowActionDropDown'

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createUserFormvisible:false,
            isEdit: false,
            editUserFormvisible: false,
            searchData:"",
            usersColumns: [
                {
                    title: 'First Name',
                    dataIndex: 'first_name',
                    key: 'first_name',
                    isFilters: true,
                    className: 'columnTitle',
                    width: 200,
                    ellipsis: true

                },
                {
                    title: 'Last Name',
                    dataIndex: 'last_name',
                    key: 'last_name',
                    isFilters: true,
                    className: 'columnTitle',
                    ellipsis: true
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                    isFilters: true,
                    className: 'columnTitle',
                    width: 250,
                    ellipsis: true
                },
                {
                    title: 'Username',
                    dataIndex: 'username',
                    key: 'username',
                    isFilters: true,
                    className: 'columnTitle',
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
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                    isFilters: true,
                    className: 'columnTitle',
                    width: 250,
                    ellipsis: true
                },
                {
                    title: '',
                    key: 'action',
                    render: (text, record) => (
                        <RowActionDropdown
                            options={[
                                { text: 'Edit', handler: this.handleEdit},
                                { text: 'Delete', handler: this.handleDelete},
                            ]}
                            item={record}
                        />
                    ),
                },

            ]

        }
    }
   
    addUser = () => {
        const { dispatch } = this.props
        this.setState({
          createUserFormvisible: true,
          isEdit: false
        });
        dispatch(setEditUser({}))
      };
    
    componentDidMount() {
        this.getUsersData();
    }
    handleDelete = (user) => {
        const { dispatch } = this.props;
        dispatch(deleteUser(user.id))
    }

    handleEdit = (user) => {
        this.setState({editUserFormvisible: true, isEdit: true})
        const {dispatch} = this.props
        dispatch(setEditUser(user))
    }

    getUsersData = () => {
        const { dispatch } = this.props;
        dispatch(fetchUsersList())
    }

    handleSubmit=() => {
        const {dispatch, editedUserData} = this.props
        if (editedUserData.id) {
            dispatch(updateUser(editedUserData))
            .then(response =>{
                if(response && response.type != 'error'){
                    this.handleOnClose()
                    dispatch(setEditUser({}))
                }  
            })
        }else{
            dispatch(CreateUser(editedUserData))
            .then(response =>{
                if(response && response.type != 'error'){
                    this.handleOnClose()
                    dispatch(setEditUser({}))
                }  
            }) 
        }
    }
    
    handleOnClose = () => {
        const { dispatch } = this.props
        dispatch(setEditUser({}))
        this.setState({  createUserFormvisible: false, editUserFormvisible: false, })
    }
    
    search = (e) => {
        const { dispatch } = this.props
        var search = this.state.searchData
        var  searchData = e.target.value
        if(!searchData){
            searchData = search
        }else{
            searchData  = e.target.value
        }
        dispatch(fetchUsersList(searchData))
    };

    render() {
        const {usersData} = this.props
        const { usersColumns,createUserFormvisible,editUserFormvisible} = this.state
        return ( 
            <div className='user-table-container'>
                <h3>Users</h3>
                <hr/>
                <div className='table-wrapper'>
                    <Row>
                        <Col  span={22}>
                            <Input
                                prefix ={<SearchOutlined />}
                                placeholder="Search "
                                enterButton
                                className="search-box"
                                onChange={(e) => this.search(e)}
                            />
                        </Col>
                        <Col  span={2}>
                            <Button type="primary" onClick={this.addUser} className='create-user-btn'>
                                Create User
                            </Button>
                        </Col>
                    </Row>
                    <TableComponent columns={usersColumns} dataSource={ usersData.data} className='users-table'/>
                </div>
                <FormSlideout 
                    title="Create New User"     
                    onClose={() =>this.handleOnClose()} 
                    visible={createUserFormvisible} 
                    primaryBtnEvent={() => this.handleSubmit()}
                    primary_button_name="Save" 
                    formElement={<UsersForm isEdit={this.state.isEdit} />} 
                    className="user-form-container" 
                    form='users-form'  
                />
                <FormSlideout
                    title="Edit User"
                    onClose={() => this.handleOnClose()}
                    visible={editUserFormvisible}
                    primaryBtnEvent={() => this.handleSubmit()}
                    primary_button_name='Save'
                    formElement={
                        <UsersForm isEdit={this.state.isEdit}/>
                    }
                    className="user-form-container"
                    form='users-form'
                />
            </div>           
        )
    }
}
function mapStateToProps(state) {  
    const { usersData, editedUserData} = state.users;
    return {
        usersData, editedUserData
    }
}
export default connect(mapStateToProps)(UsersTable);