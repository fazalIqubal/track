import { tenantConstants } from '../constants';
import { tenantService } from '../service';
import { Toast } from '../../../wrapperComponents/notificationToast/notificationToast'

export const fetchTenantListSuccess = request => ({
    type: tenantConstants.FETCH_TENANT_DATA,
    payload: request
})

export const fetchLineChartData = (tenantListAll)=>({
    type:  tenantConstants.FETCH_LINE_CHART_DATA,
    payload: tenantListAll.data
})

export const fetchTenantList = () => {
    return dispatch => {
        return tenantService.fetchTenantList()
            .then(response => {
                dispatch(fetchTenantListSuccess(response));
                return response;
                })
                .catch(error => { 
                    Toast("error", "Unauthorised Request")
                })
    }
}

export const fetchTenantListAllSuccess = request => ({
    type: tenantConstants.FETCH_TENANT_DATA_All,
    payload: request
})

export const fetchTenantListAll = () => {
    return dispatch => {
        return tenantService.fetchTenantListAll()
            .then(response => {
                dispatch(fetchTenantListAllSuccess(response));
                dispatch(fetchLineChartData(response));
                return response;
            })
            .catch(error => { 
                dispatch(fetchTenantListSuccess(error.message))
            })
    }
}

export const formError = request => ({
    type: tenantConstants.SAVE_ERROR,
    payload: request
})

export const editTenant = request => ({
    type: tenantConstants.SAVE_EDITED_TENANT,
    payload: request
})
export const addTenant = (tenant) => {
    return dispatch => {
        return tenantService.createTenant(tenant)
            .then(response => {
                dispatch(fetchTenantList())
                Toast(response.type, response.message)
                return response;
            })
    }
}
export const updateTenant = (tenant, id) => {
    return dispatch => {
        return tenantService.updateTenant(tenant, id)
            .then(response => {
                dispatch(fetchTenantList())
                Toast(response.type, response.message)
                return response;
            })
    }
}

export const deleteTenant = (tenant) => {
    return dispatch => {
        return tenantService.deleteTenant(tenant)
            .then(response => {
                dispatch(fetchTenantList())
                Toast(response.type, response.message)
                return response;
            })
    }
}