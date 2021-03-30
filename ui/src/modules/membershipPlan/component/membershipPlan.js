import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMembershipPlan, setMembershipPlan, createdMembershipPlan, updateMembershipPlan, deleteMembershipPlan, setEditMembershipPlan } from '../action/membershipPlan.actions'
import { TableComponent } from '../../../wrapperComponents/table/table'
import { Button } from 'antd';
import { FormSlideout } from '../../../wrapperComponents/formSlideout/slideoutComponent'
import './membershipPlan.scss'
import MembershipPlanForm from './membershipPlanForm'
import RowActionDropdown from '../../../wrapperComponents/rowActionDropDown/rowActionDropDown'

class MembershipPlansList extends Component {
    constructor() {
        super();
        this.state = {
            membershipPlansList: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    isFilters: true,
                    className: 'columnTitle',
                    ellipsis: true,
                    width: 150,
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    isFilters: true,
                    className: 'columnTitle',
                    ellipsis: true,
                    width: 150,
                },
                {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    isFilters: true,
                    className: 'columnTitle'
                },
                {
                    title: 'Project Limit',
                    dataIndex: 'project_limit',
                    key: 'project_limit',
                    isFilters: true,
                    className: 'columnTitle'
                },
                {
                    title: 'User Limit',
                    dataIndex: 'user_limit',
                    key: 'user_limit',
                    isFilters: true,
                    className: 'columnTitle'
                },
                {
                    title: 'Plan Duration',
                    dataIndex: 'plan_duration',
                    key: 'plan_duration',
                    isFilters: true,
                    className: 'columnTitle',
                    width: 150,
                },
                {
                    title: 'Created By',
                    dataIndex: 'created_by',
                    key: 'created_by',
                    isFilters: true,
                    className: 'columnTitle '
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
            ],
            createMembershipPlanFormvisible: false,
            editMembershipPlanFormvisible: false,
            isEdit: false
        }
    }
    addMembershipPlan = () => {
        const { dispatch } = this.props
        this.setState({
            createMembershipPlanFormvisible: true,
            isEdit: false
        });
        dispatch(setEditMembershipPlan({}))
    };

    handleSave = () => {
        const {dispatch, editedMembershipPlanList} = this.props
        if(editedMembershipPlanList.id){
            dispatch(updateMembershipPlan(editedMembershipPlanList, editedMembershipPlanList.id))
            .then(response =>{
                this.handleOnClose()
            }).catch(err => {
                
            })
        }else{
            dispatch(createdMembershipPlan(editedMembershipPlanList))
            .then(response =>{
                this.handleOnClose()
            }).catch(err => {
                
            })
        }
    }
    componentDidMount() {
        this.getMembershipPlanList()
    }
    getMembershipPlanList = () => {
        const { dispatch } = this.props;
        dispatch(fetchMembershipPlan())
    }
    handleEdit = (e) => {
        this.setState({ editMembershipPlanFormvisible: true, isEdit: true })
        const { dispatch } = this.props
        dispatch(setEditMembershipPlan(e))
        dispatch(setMembershipPlan(e))
    }

    handleDelete = (e) => {
        const { dispatch } = this.props;
        dispatch(deleteMembershipPlan(e.id))
    }

    handleOnClose = () => {
        const { dispatch } = this.props
        dispatch(setEditMembershipPlan({}))
        this.setState({ createMembershipPlanFormvisible: false, editMembershipPlanFormvisible: false })
    }

    render() {
        const { membershipPlansList, createMembershipPlanFormvisible, editMembershipPlanFormvisible, isEdit } = this.state;
        const { membershipPlanList } = this.props
        return (
            <div className='membershipPlan-table-container'>
                <h3 className="membershipPlan-heading">Membership Plans</h3>
                <div className='table-wrapper'>
                    <Button type="primary" className='create-membershipPlan-btn' onClick={() => this.addMembershipPlan()}>Create Membership Plan</Button>
                    <TableComponent
                        className='membershipPlan-table'
                        columns={membershipPlansList}
                        dataSource={membershipPlanList.data}
                    />
                </div>
                <FormSlideout
                    className="membershipPlan-form-container"
                    title="Create New Membership Plan"
                    onClose={() => this.handleOnClose()}
                    visible={createMembershipPlanFormvisible}
                    primaryBtnEvent={() => this.handleSave()}
                    primary_button_name='Save'
                    form='membershipPlanForm'
                    formElement={
                        <MembershipPlanForm isEdit={isEdit} />
                    }
                />
                <FormSlideout
                    className="membershipPlan-form-container"
                    title="Edit Membership Plan"
                    onClose={() => this.handleOnClose()}
                    visible={editMembershipPlanFormvisible}
                    primaryBtnEvent={() => this.handleSave()}
                    primary_button_name='Save'
                    form='membershipPlanForm'
                    formElement={
                        <MembershipPlanForm isEdit={isEdit} />
                    }
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { membershipPlanList, editedMembershipPlanList } = state.membershipPlan;
    return {
        membershipPlanList, editedMembershipPlanList
    }
}
export default connect(mapStateToProps)(MembershipPlansList)
