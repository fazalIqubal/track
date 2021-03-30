import React from 'react';
import ReactDOM from 'react-dom';
import  UsersForm  from './createUsersForm'
import { shallowToJson} from 'enzyme-to-json';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { setEditUser } from '../../action/users.actions'

const middlewares = [thunk]
Enzyme.configure({ adapter: new Adapter() })
 
var usersData = {first_name: 'jyoti', last_name : 'hhd',address : 'hhd', username : 'hhd', mobile : 8521479630, email : 'jytahsdghgh544.com'} 
describe('when page is rendering', () => {
    let formcomponent
    const mockDispatch = jest.fn(); 
    beforeEach(() => {
        formcomponent = shallow(<UsersForm.WrappedComponent editedUserData ={usersData}  dispatch={mockDispatch}/>)
    })
    afterEach(() => {
        formcomponent = null 
    })
    it('should render the form', ()=> {
        expect(shallowToJson(formcomponent)).toMatchSnapshot();
    })
    it('should check the form lable', ()=> {
        expect(formcomponent.find('FormItem[name="first_name"]').exists()).toEqual(true)
        expect(formcomponent.find('FormItem[name="last_name"]').exists()).toEqual(true)
        expect(formcomponent.find('FormItem[name="address"]').exists()).toEqual(true)
        expect(formcomponent.find('FormItem[name="username"]').exists()).toEqual(true)
        expect(formcomponent.find('FormItem[name="mobile"]').exists()).toEqual(true)
        expect(formcomponent.find('FormItem[name="email"]').exists()).toEqual(true)
    })
    it('should check input box ', ()=> {
        expect(formcomponent.find('Input[name="first_name"]').exists()).toEqual(true)
        expect(formcomponent.find('Input[name="last_name"]').exists()).toEqual(true)
        expect(formcomponent.find('Input[name="address"]').exists()).toEqual(true)
        expect(formcomponent.find('Input[name="username"]').exists()).toEqual(true)
        expect(formcomponent.find('Input[name="mobile"]').exists()).toEqual(true)
        expect(formcomponent.find('Input[name="email"]').exists()).toEqual(true)
    })

    it('should pre fill first_name', ()=> {
        expect(formcomponent.find('Input[name="first_name"]').props().value).toBe(usersData.first_name);
    })

    it('should pre fill last_name', ()=> {
        expect(formcomponent.find('Input[name="last_name"]').props().value).toBe(usersData.last_name);
    })

    it('should pre fill address', ()=> {
        expect(formcomponent.find('Input[name="address"]').props().value).toBe(usersData.address);
    })

    it('should pre fill username', ()=> {
        expect(formcomponent.find('Input[name="username"]').props().value).toBe(usersData.username);
    })

    it('should pre fill mobile', ()=> {
        expect(formcomponent.find('Input[name="mobile"]').props().value).toBe(usersData.mobile);
    })

    it('should pre fill email', ()=> {
        expect(formcomponent.find('Input[name="email"]').props().value).toBe(usersData.email);    
    })   
})
describe('>>>Settings --- REACT-REDUX (Mount + wrapping in <Provider>)', () => {
    const initialState = {
    users: {
        editedUserData: {

    },
    
    }
    }
    const mockStore = configureStore(middlewares)
    let store, wrapper

    beforeEach(() => {

        Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        })),
        });

        store = mockStore(initialState)
        store.dispatch = jest.fn();
        wrapper = mount(<Provider store={store}>
        <UsersForm /></Provider>)
    })
    it('+++ render the connected(UsersForm) component', () => {
        console.log(wrapper)
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find(UsersForm).length).toEqual(1)
    });

    it('when change Award first_name text', () => {
        wrapper.find('#first_name').at(0).simulate('change', { target: { value: 'jyoti', name: 'first_name' } });
        expect(wrapper.find('#first_name').at(0).props().value).toEqual('jyoti');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setEditUser({first_name: "jyoti"}));
    });
    it('when change Award last_name text', () => {
        wrapper.find('#last_name').at(0).simulate('change', { target: { value: 'dhami', name: 'last_name' } });
        expect(wrapper.find('#last_name').at(0).props().value).toEqual('dhami');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setEditUser({last_name: "dhami"}));
    });
    it('when change Award address text', () => {
        wrapper.find('#address').at(0).simulate('change', { target: { value: 'banglore', name: 'address' } });
        expect(wrapper.find('#address').at(0).props().value).toEqual('banglore');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setEditUser({address: "banglore"}));
    });
    it('when change Award username text', () => {
        wrapper.find('#username').at(0).simulate('change', { target: { value: 'jyotiDhami', name: 'username' } });
        expect(wrapper.find('#username').at(0).props().value).toEqual('jyotiDhami');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setEditUser({username: "jyotiDhami"}));
    });
    it('when change Award mobile text', () => {
        wrapper.find('#mobile').at(0).simulate('change', { target: { value: '8755877269', name: 'mobile' } });
        expect(wrapper.find('#mobile').at(0).props().value).toEqual('8755877269');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setEditUser({mobile: "8755877269"}));
    });
     it('when change Award email text', () => {
        wrapper.find('#email').at(0).simulate('change', { target: { value: 'jyotidhami12@gmail.com', name: 'email' } });
        expect(wrapper.find('#email').at(0).props().value).toEqual('jyotidhami12@gmail.com');
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setEditUser({email: "jyotidhami12@gmail.com"}));
    });

});


