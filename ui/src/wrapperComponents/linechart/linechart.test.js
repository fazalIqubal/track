import React from 'react';
import {LineChart} from './linechart';
import ReactDOM from 'react';
import {configure, shallow} from 'enzyme';
import { shallowToJson} from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';


configure({adapter: new Adapter()});

describe('should render correctly', () =>{
    let lineChartOutput;
    beforeEach(() => {
        lineChartOutput= shallow(<LineChart/>)
    });
    afterEach(()=>{
        lineChartOutput= null
    })
    it('should renders correctly', () => {
        expect(lineChartOutput).toMatchSnapshot();
       });

    it('should containe a linechart component', () =>{
        expect(lineChartOutput.find('.lineChart').exists()).toEqual(true)
    })
})


