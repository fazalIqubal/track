import { requestGet, requestPut, requestDelete, requestPost } from '../../../services/requests';
import {apiTenantEndpoint} from '../../../services/endpoint'

export class TenantService {
    constructor(authEndpoint) {
        this.authEndpoint = authEndpoint;
    }

    fetchTenantList() {
        return requestGet(apiTenantEndpoint, {})
    }

    fetchTenantListAll(includeDeleted = 'True') {
        return requestGet(apiTenantEndpoint+includeDeleted, {})
    }

    createTenant(tenant) {
       return requestPost(apiTenantEndpoint, tenant)
    }

    updateTenant(tenant, id) {
        return requestPut(apiTenantEndpoint+id, tenant)
    }

    deleteTenant(tenant) {
        return requestDelete(apiTenantEndpoint+ tenant)
    }
    getTenantById(tenant) {
        return requestGet(apiTenantEndpoint+tenant.id, {})
    }
}

