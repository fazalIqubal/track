import React from 'react';
import { Space, Dropdown, Menu,  } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons';

export default class RowActionDropdown extends React.Component {
    render() {
        const {options} = this.props
        return (
            <Space size="middle">
                <Dropdown overlay={
                    <Menu>
                        {
                            options.map((value, index) => {
                                return (
                                    <Menu.Item key={index} onClick={()=>value.handler(this.props.item)}>
                                        {value.text}
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu>
                }>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <EllipsisOutlined />
                    </a>
                </Dropdown>
            </Space>
        )
    }
}
