import React from 'react';
import ReactDOM from 'react-dom';
import {configure, shallow } from 'enzyme';
import { shallowToJson} from 'enzyme-to-json';
import RowActionDropdown from './rowActionDropDown'
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('should render correctly', () => {
    let rowDropDown;
    beforeEach(() => {
        rowDropDown = shallow(<RowActionDropdown/>
        );
    });
    afterEach(() => {
        rowDropDown = null;
    });

    it('should render correctly ', () => {
        expect(shallowToJson(rowDropDown)).toMatchSnapshot()
    });

    it('contains an <Space/> component', () => {
        expect(rowDropDown.find('Space').exists()).toEqual(true);
    });

    it('should have <Dropdown/>', () => {
        expect(rowDropDown.find('Dropdown').exists()).toEqual(true);
    });
})