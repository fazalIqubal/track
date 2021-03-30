import React from 'react';
import './countcard.scss';
import {Row, Col, Card, Statistic} from 'antd'

export class CountCard extends React.Component{
    render(){
        return(
            <Card>
                <Row>
                    <Col span={12}>
                        <Statistic
                            className={this.props.className}
                            value={this.props.value}
                            title={this.props.title}
                        />
                    </Col>
                    <Col span={12} className='card-icon'>
                       <img src= {this.props.icon} className="icon-img" />
                    </Col>
                </Row>
            </Card> 
            
        )
    }
}
