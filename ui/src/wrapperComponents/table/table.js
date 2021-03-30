import React from 'react'
import {
    Table, Pagination
} from 'antd';
import './table.scss'
import PageLoader from '../loader/loader'

export class TableComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: '',
            searchedColumn: '',
            filteredInfo: {},
            sortedInfo: {},
            data: [],
            columns: [],
            pageSizeOptions: ['5', '10', '20', '30'],
            defaultPageSize: 5,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource) {
            this.listMaper((this.state.columns || this.props.columns), nextProps.dataSource)
        }
    }

    componentDidMount() {
        this.listMaper(this.props.columns, this.props.dataSource)
    }

    listMaper = (columns, dataSource) => {
        columns.map(column => {
            if (column.isFilters == true && dataSource) {
                column.filters = dataSource.map(data => {
                    var filter = { text: data[column.dataIndex], value: data[column.dataIndex] }
                    return filter
                });
                column.onFilter = (value, record) => this.onFilterHandeler(column.dataIndex, value, record)
                var obj = {};
                for (var i = 0, len = column.filters.length; i < len; i++) {
                    obj[column.filters[i]['text']] = column.filters[i];
                }
                column.filters = new Array();
                for (var key in obj) {
                    column.filters.push(obj[key]);
                }
            }

            console.log(column.filters)
        })
        this.setState({ columns: columns, data: dataSource })
    }
    onFilterHandeler = (columnName, value, record) => {
        return ((record[columnName]).toString()).includes(value.toString())
    }

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    clearFilters = () => {
        this.setState({ filteredInfo: {} });
    };

    clearAll = () => {
        this.setState({
            filteredInfo: {},
            sortedInfo: {},
        });
    };
    render() {
        let length = (this.state.data && this.state.data.length) || 0
        return (
            <Table columns={this.state.columns}
                dataSource={this.state.data}
                onChange={this.handleChange}
                pagination={{ defaultPageSize: this.state.defaultPageSize, showSizeChanger: true, pageSizeOptions: this.state.pageSizeOptions, total: length, hideOnSinglePage: this.props.hide }}
            >
            </Table>
        )
    }
}