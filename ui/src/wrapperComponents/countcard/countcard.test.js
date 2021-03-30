import React from 'react';
import {CountCard} from './countcard'; 
import { configure, shallow } from 'enzyme';
import { shallowToJson} from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('should render correctly', () => {
    let cardOutput;
    beforeEach(() => {
        cardOutput = shallow(<CountCard/>
        );
    });
    afterEach(() => {
        cardOutput = null;
    });

    it('should render correctly ', () => {
        expect(shallowToJson(cardOutput)).toMatchSnapshot()
    });

    it('contains an <Card/> component', () => {
        expect(cardOutput.find('Card').exists()).toEqual(true);
    });

    it('should have icon', () => {
        expect(cardOutput.find('img').exists()).toEqual(true);
    });

})