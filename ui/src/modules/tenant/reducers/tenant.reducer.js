import { tenantConstants } from '../constants';
import { combineReducers } from 'redux';
import createReducer from '../../../helpers/createReducer';
import moment from 'moment';
import _ from "lodash"

const getTenantListReducer = createReducer([])({
    [tenantConstants.FETCH_TENANT_DATA]: (state, action) => action.payload,
})
const getTenantListAllReducer = createReducer([])({
    [tenantConstants.FETCH_TENANT_DATA_All]: (state, action) => action.payload,
})
const editedTenantData = createReducer([])({
    [tenantConstants.SAVE_EDITED_TENANT]: (state, action) =>  action.payload,
})
const formError = createReducer([])({
    [tenantConstants.SAVE_ERROR]: (state, action) =>  action.payload,
})
const getLinechartDataReducer = createReducer({})({
    [tenantConstants.FETCH_LINE_CHART_DATA]: (state, action) => {
        if(action.payload){
            var last7DayStart = moment().startOf('day').subtract(1,'week');
            var filterdata = action.payload.filter(d => {
                return moment(d.created_at).isBetween(last7DayStart, moment())
            })
            var mapData = _.map(filterdata,(e) =>{
                e.created_at =  moment(e.created_at).format('MM/DD/YYYY')
                return _.pick(e, 'created_at').created_at 
            })
            var datesCount =_.reverse( Object.values(_.countBy(mapData)));
            var linechartdata  = _.reverse(_.uniqBy(mapData, function (e) { return e }))
            return   {categories: linechartdata, series: datesCount}
        }else{
            return [];
        }
      
     
    },
  })

export default combineReducers({
    tenantList: getTenantListReducer,
    tenantListAll: getTenantListAllReducer,
    editedTenant: editedTenantData,
    errors: formError,
    lineChartdata: getLinechartDataReducer
})