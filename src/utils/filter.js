import geo from '../static/clipped_poly';
import cloneDeep from 'lodash/cloneDeep';

export const filterGeo = legends=>{
    var f = cloneDeep(geo);
    f.features = f.features.filter(v=> legends[v.properties.GWS_GEWASC])
    return f;
};