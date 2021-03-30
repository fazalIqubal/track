import React, { Component } from 'react';
import { Redirect, Route, Switch, Link} from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../../routes';
import logo from '../../image/logo1.png';
import tenantIcon from '../../image/tenantIcon.svg'
import './MainLayout.scss'
import _ from 'lodash';
import {
    Layout,
    Menu,
    Dropdown
} from 'antd';
import {
    DashboardOutlined,
    GroupOutlined,
    DatabaseOutlined,
    TeamOutlined,
    UserOutlined,
    DownOutlined,
    UserAddOutlined
} from '@ant-design/icons';
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const menu = (
    <Menu>
        <Menu.Item>
            <Link to='#'>
                Account Settings
            </Link>
        </Menu.Item>
        <Menu.Item><Link to='/login'>Log Out</Link></Menu.Item>
    </Menu>
);
const sidebarMenu = [
    {
        key: 1,
        icon: <DashboardOutlined />,
        urlPath: '/dashboard',
        text: 'Dashboard',
        keyPath:["1"]
    },
    {
        key: 2,
        icon: <GroupOutlined />,
        urlPath: '/tenants',
        text: 'Tenants',
        keyPath:["2"]
    },
    {
        key: 3,
        icon: <UserAddOutlined />,
        urlPath: '/users',
        text: 'Users',
        keyPath:["3"]
    },
    {
        key: 4,
        icon: <DatabaseOutlined />,
        urlPath: '/membership-plan',
        text: 'Membership Plans',
        keyPath:["4"]
    },
]
export class MainLayout extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: true,
        }
    }   
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };
    render() {
        const { user, location } = this.props;
        const filteredRoutes = _.filter(routes, (route) => {
            return true;
        })
        const currentMenu = sidebarMenu.find(x => x.urlPath == location.pathname) || _.first(sidebarMenu);

        return (
            <Layout style={{ height: "100vh" }}>
                <Layout style={{ flexDirection: "row", overflowX: "hidden" }}>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'inline-block' }}>
                        <a href='/dashboard' title='Trackify'> <img className='logo' src={logo} /></a>
                        <div className='profile-icon' style={{ display: "inline-block", float: 'right' }}>
                            <span><UserOutlined /></span>

                            <span style={{ marginLeft: '10px' }}>
                                <Dropdown overlay={menu}>
                                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                        <DownOutlined />
                                    </a>
                                </Dropdown>
                            </span>
                        </div>
                    </Header>
                    <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <Menu theme="light" defaultSelectedKeys={currentMenu.keyPath} mode="inline">
                            {
                                sidebarMenu.map(menuItem => {
                                    if (!menuItem.children) {
                                        return (
                                            <Menu.Item key={menuItem.key} icon={menuItem.icon}  >
                                                {
                                                    menuItem.urlPath &&
                                                    <Link to={menuItem.urlPath}>{menuItem.text}</Link>
                                                }
                                                {
                                                    !menuItem.urlPath &&
                                                    menuItem.text
                                                }

                                            </Menu.Item>
                                        )
                                    } else {
                                        return (
                                            <SubMenu key={menuItem.key} icon={menuItem.icon} title={menuItem.title}>
                                                {
                                                    menuItem.children.map(child => {
                                                        return (
                                                            <Menu.Item key={child.key}>
                                                                {
                                                                    child.urlPath &&
                                                                    <Link to={child.urlPath}>{child.text}</Link>
                                                                }
                                                                {
                                                                    !child.urlPath &&
                                                                    child.text
                                                                }
                                                            </Menu.Item>
                                                        )
                                                    })
                                                }
                                            </SubMenu>
                                        )
                                    }
                                })
                            }
                        </Menu>
                    </Sider>
                    <Layout
                        className="content-main-layout"
                    >
                        <Content
                            className="app-content"
                            style={{
                                padding: "70px 0 0",
                                flexShrink: "0",
                                background: "#f1f3f6",
                                position: "relative"
                            }}
                        >
                            <Switch>
                                {
                                    filteredRoutes.map((route, idx) => {
                                        return route.component ? (<Route key={idx} path={route.path} exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                localStorage.getItem('user')
                                                    ? <route.component {...props} />
                                                    : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                                            )} />)
                                            : (localStorage.getItem('user')
                                                ? ""
                                                : <Redirect key={idx} to={{ pathname: '/login' }} />);
                                    })
                                }

                                {
                                    (!user || !user.accesstoken) &&
                                    <Redirect to={{ pathname: '/login' }} />
                                }
                                {
                                    user && user.accesstoken &&
                                    <Redirect from="/" to="/dashboard" />
                                }
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user
    }
}
export default connect(mapStateToProps)(MainLayout);
