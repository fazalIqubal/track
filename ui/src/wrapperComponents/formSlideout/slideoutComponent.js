import React from 'react';
import './slider.scss'
import {
    Button, Drawer,
} from 'antd';

export class FormSlideout extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <Drawer
                title={this.props.title}
                width={400}
                onClose={this.props.onClose}
                visible={this.props.visible}
                bodyStyle={{ paddingBottom: 80 }}
                forceRender={true}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                       
                        <Button form={this.props.form} onClick={this.props.primaryBtnEvent} type="primary" style={{ marginRight: 8 }} htmlType="submit" className='create-tenant-form-btn'>
                            {this.props.primary_button_name}
                        </Button>
                        <Button onClick={this.props.onClose} className='cancel-btn'>
                            Cancel
                        </Button>
                    </div>
                }
            >
                {this.props.formElement}
            </Drawer>
        )
    }
}
