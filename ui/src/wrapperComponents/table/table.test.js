import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { TableComponent } from './table';

Enzyme.configure({ adapter: new Adapter() })

const columns = [
    {
        title: 'Issue ID',
        dataIndex: 'issueId',
        key: 'issueId',
        render: text => <a>{text}</a>,
        className: 'columnTitle'
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        isFilters: true,
        className: 'columnTitle'

    },
    {
        title: 'Issue Status',
        dataIndex: 'issueStatus',
        key: 'issueStatus',
        isFilters: true,
        className: 'columnTitle'
    },
    {
        title: 'Priority',
        key: 'tags',
        dataIndex: 'tags',

        render: tags => (
            <>
                {tags.map(tag => {
                    let color = tag == 'High' ? 'red' : tag == 'Medium' ? 'orange' : 'green'
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
        className: 'columnTitle'
    },  
    {
        title: 'Issue Type',
        dataIndex: 'issueType',
        key: 'issueType',
        className: 'columnTitle'
    },
    {
        title: 'Reporter',
        dataIndex: 'issueReporter',
        key: 'issueReporter',
        className: 'columnTitle'
    },
    {
        title: 'Assigned To',
        dataIndex: 'name',
        key: 'name',
        className: 'columnTitle'
    },
]
const dataSet = [
    {
        key: '1',
        issueId: '001',
        title: 'Issue #1',
        issueStatus: 'Open',
        tags: ['Medium'],
        issueType: 'Defect',
        issueReporter: 'Chetan Dhami',
        name: 'John Brown',
    },
    {
        key: '2',
        issueId: '002',
        title: 'Issue #2',
        issueStatus: 'In-Progress',
        tags: ['Low'],
        issueType: 'UI Fix',
        issueReporter: 'Yogesh Dhami',
        name: 'John Brown',
    },
    {
        issueId: '001',
        title: 'Issue #3',
        issueStatus: 'Open',
        tags: ['High'],
        issueType: 'New Feature',
        issueReporter: 'Chetan Dhami',
        name: 'John Brown',
    },
]
let output
describe('Table component test case', () => {
    beforeEach(() => {
        output = shallow(
            <TableComponent columns={columns} dataSource={dataSet} />
        );
    })
    afterEach(() => {
        output = null;
    });

    it('should render correctly', () => {
        expect(shallowToJson(output)).toMatchSnapshot();
    })

})