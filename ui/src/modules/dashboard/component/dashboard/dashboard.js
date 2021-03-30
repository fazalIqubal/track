import React, { Component } from 'react';
import { connect } from 'react-redux';
import './dashboard.scss';
import { fetchTenantList, fetchTenantListAll } from '../../../tenant/action/tenant.actions'
import { fetchMembershipPlan } from '../../../membershipPlan/action/membershipPlan.actions'
import { TableComponent } from '../../../../wrapperComponents/table/table'
import { CountCard } from '../../../../wrapperComponents/countcard/countcard'
import { LineChart } from '../../../../wrapperComponents/linechart/linechart'
import PieChartCard from '../../../../wrapperComponents/pieChart/PieChartCard';
import Totaltenant from '../../../../image/active-issues.svg'
import Deletedtenant from '../../../../image/open-issues.svg'
import InActivetenant from '../../../../image/progress-issues.svg'
import Activetenant from '../../../../image/resolved-issues.svg'
import "antd/dist/antd.css";
import { Empty } from 'antd';
import {
    Layout,
    Card,
    Row,
    Col, Progress, Button
} from 'antd';
import { Link } from 'react-router-dom';

class AdminDashboard extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: true,
            searchText: '',
            searchedColumn: '',
            tenantsList: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    isFilters: false,
                    className: 'columnTitle',
                    width: 200,
                    ellipsis: true
                },
                {
                    title: 'Company Name',
                    dataIndex: 'company_name',
                    key: 'company_name',
                    isFilters: false,
                    className: 'columnTitle',
                    width: '100',
                    ellipsis: true
                },
                {
                    title: 'Company Size',
                    dataIndex: 'company_size',
                    key: 'company_size',
                    isFilters: false,
                    className: 'columnTitle'
                },
                {
                    title: 'Country',
                    dataIndex: 'country',
                    key: 'country',
                    isFilters: false,
                    className: 'columnTitle'
                },
            ],
            pieChartSeries:[],
            pieChartLabel: [],
            pieChartColors: []

        };
    }
    componentWillMount() {
        this.getTenantList();
        this.getTenantListAll();
        this.getMembershipPlan();
    }
    componentWillReceiveProps(nextProps) {
        this.getPieChartData();
    }

    getTenantList = () => {
        const { dispatch } = this.props;
        dispatch(fetchTenantList())
    }

    getTenantListAll = () => {
        const { dispatch } = this.props;
        dispatch(fetchTenantListAll())
    }
    getMembershipPlan = () => {
        const { dispatch } = this.props;
        dispatch(fetchMembershipPlan())
    }
    
    getPieChartData = () =>{
        const {tenantListAll}= this.props
        if(tenantListAll && tenantListAll.data && tenantListAll.data.length >0){
            let active, inactive, deleted;
            active = inactive = deleted = 0;
            tenantListAll.data.map((tenant) => {
                if(tenant.isActive == true && tenant.isDeleted == false){ active++ }
                if(tenant.isActive == false){ inactive++ }
                if(tenant.isDeleted == true){ deleted++ }
            })
            const pieChartSeries = [active, inactive, deleted]
            const pieChartLabel = ['Active' ,'Inactive' ,'Deleted']
            const pieChartColors = ['#1abb9c', '#f39c12', '#dd4b39']
            this.setState({pieChartSeries, pieChartLabel, pieChartColors})
        }
    }

    render() {
        const { tenantList, tenantListAll, lineChartdata, membershipPlanList} = this.props
        const { tenantsList } = this.state;
       
        return (
            <Layout theme='light' style={{ minHeight: '100vh' }}>
                <Layout className="site-layout">
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }} >
                        <div className='sprint-name heading'>Tenants Overview</div>
                        <Row>
                            <Col span={24}>
                                <div className="tenant-overview-cards" span={18}>
                                    {
                                        tenantListAll.data &&
                                        <Row gutter={16}>
                                            <Col span={6}>
                                                <CountCard
                                                    className='total-tenant heading'
                                                    value={tenantListAll.data.length}
                                                    title='Total Tenants'
                                                    icon={Totaltenant}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <CountCard
                                                    className='active-tenant heading'
                                                    value={(tenantListAll.data.filter(tenantData => tenantData.isActive == true)).length - (tenantListAll.data.filter(tenantData => tenantData.isDeleted == true)).length}
                                                    title='Active'
                                                    icon={Activetenant}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <CountCard
                                                    className='inactive-tenant heading'
                                                    value={(tenantListAll.data.filter(tenantData => tenantData.isActive == false)).length}
                                                    title='Inactive'
                                                    icon={InActivetenant}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <CountCard
                                                    className='deleted-tenant heading'
                                                    value={(tenantListAll.data.filter(tenantData => tenantData.isDeleted == true)).length}
                                                    title='Deleted'
                                                    icon={Deletedtenant}
                                                />
                                            </Col>
                                        </Row>
                                    }

                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16} className='left-dash-content'>
                                <Card className='line-chart'>
                                    {lineChartdata.categories && <LineChart className='linechart'
                                        titleText={'Tenants Onboard'}
                                        categories={lineChartdata.categories}
                                        series={[{
                                            name: "Tenant",
                                            data: lineChartdata.series
                                        }]}
                                    />}
                                </Card>
                            </Col>
                            <Col span={8} className='left-pane'>
                                <Card className='pie-chart'>
                                    {
                                        tenantListAll.data &&
                                        <PieChartCard
                                            className="generic-pie-width"
                                            series={this.state.pieChartSeries}
                                            labels={this.state.pieChartLabel}
                                            colors={this.state.pieChartColors}
                                        />
                                    }
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16} className='left-dash-content'>
                                <div className='tenants-list-container'>
                                { tenantList.data &&
                                    <Card title="Latest Tenants"   actions={[
                                        <div className='view-all-link'>
                                            <Link to='/tenants'><a>View All</a></Link>
                                        </div>
                                     
                                      ]}>
                                        <div className='tenant-list-row-container'>
                                            <Row className='tenant-heading-container'>
                                                <Col span={6}>
                                                    <h5 className='tenant-list-headings heading'>Name</h5>
                                                </Col>
                                                <Col span={6}>
                                                    <h5 className='tenant-list-headings heading'>Company Name</h5>
                                                </Col>
                                                <Col span={6}>
                                                    <h5 className='tenant-list-headings heading'>Country</h5>
                                                </Col>
                                                <Col span={6}>
                                                    <h5 className='tenant-list-headings heading'>Company Size</h5>
                                                </Col>
                                            </Row>
                                            {
                                                tenantList.data.length >0 ?
                                                <div>
                                                    {
                                                        ((tenantList.data).slice(0, 5)).map(list => {
                                                            return(
                                                                <Row>
                                                                    <Col span={6}>
                                                                        <p className=' heading listing-font-size tenant-list-data'>{list.name}</p>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <p className=' heading listing-font-size tenant-list-data'>{list.company_name}</p>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <p className=' heading listing-font-size tenant-list-data'>{list.country} </p>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <p className=' heading listing-font-size tenant-list-data'>{list.company_size}</p>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        })
                                                    }
                                                </div>: <Empty />
                                            }
                                        </div>
                                    </Card>
                                }
                                </div>
                            </Col>
                            <Col span={8} className='left-dash-content'>
                                <div className='membershipPlan-container'>
                                    { membershipPlanList.data &&
                                        <Card title="Membership Plans"   >
                                            {
                                                membershipPlanList.data.length >0 ?
                                                <div>
                                                    {
                                                        ((membershipPlanList.data).slice(0, 3)).map(plan => {
                                                            return(
                                                                <Row>
                                                                    <Col span={18}>
                                                                        <p className=' heading listing-font-size'>{plan.name}   ({plan.plan_duration})</p>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <Button className='view-membershipPlan' ><Link to='/membership-plan'><a>View</a></Link></Button>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        })
                                                    }
                                                </div>: <Empty />
                                            }
                                        </Card>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { tenantList, tenantListAll, lineChartdata } = state.tenant;
    const {membershipPlanList} = state.membershipPlan
    return {
        tenantList, tenantListAll, lineChartdata, membershipPlanList
    }
}
export default connect(mapStateToProps)(AdminDashboard);