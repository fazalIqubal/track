import React from 'react'
import './loader.scss'
import { Spin } from 'antd';

export class PageLoader extends React.Component {
    render(){
        return (
            <div className="loading-container">
                <div className="loader">
                    <Spin />
                </div>
            </div>
        )

    }
}

