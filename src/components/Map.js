/* eslint-disable */
import React, { Component } from "react";
import OlMap from "ol/map";
import OlView from "ol/view";
import OlLayerTile from "ol/layer/tile";
import GeoJSON from 'ol/format/GeoJSON';
import OlSourceOSM from "ol/source/osm";
import Zoom from 'ol/control/Zoom';
import windowDimensions from 'react-window-dimensions';
import PropType from 'prop-types';
import '../styles/map.scss';
import MapControls from './MapControls';
import {Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import Feature from 'ol/Feature.js';
import Circle from 'ol/geom/Circle.js';
import Proj4 from 'Proj4';
import {register} from 'ol/proj/proj4';
import Popup from 'ol-popup';
import geo from '../static/clipped_poly.js';
import {filterGeo} from '../utils/filter';
import Draw from 'ol/interaction/Draw.js';

const colors = {
  1: 'purple',
  2: 'red',
  3: 'pink',
  4: 'indigo',
  5: 'blue',
  6: 'green',
  7: 'lime',
  8: 'orange',
  9: 'brown',
  10: 'grey',
  11: 'deeporange',
}

const styles =(id)=> new Style({
    stroke: new Stroke({
      color: colors[id],
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  })
const styleFunction = feature=> styles(feature.values_.GWS_GEWASC);
const geoJsonObject = geo;
let draw;
let popup;
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      center: [635047.1775508502, 6897943.454034535], 
      zoom: 12,
      initialView: true,
      showSubmit:false,
      crops: {1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true,9:true,10:true,11:true} 
    };
    this.updateLegends = this.updateLegends.bind(this);
    Proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
    register(Proj4);
    let vectorSource;
    let vectorLayer;
      vectorSource = new VectorSource({wrapX: false});
      vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction
      });
    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        }),
        vectorLayer 
      ],
      controls:[
        new Zoom({
          className:'zoom'
        })
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });
    draw = new Draw({
      source: vectorSource,
      type: 'Polygon'
    });
    this.olmap.addInteraction(draw);
  }
  updateLegends=  crops=>{ 
    let filtered = filterGeo(crops);
    let vectorSource = new VectorSource({
      features: (new GeoJSON({
        dataProjection: 'EPSG:28992',
        featureProjection: 'EPSG:3857'
      })).readFeatures(filtered)
    });
    vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));
    this.olmap.getLayers().array_[1].setSource(vectorSource);
  };

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }
  showResults = ()=>{
    this.setState({
      initialView: false
    })
  }
  showPop = ()=> {
      this.olmap.on('pointermove', (event) => {
        if(event)
        this.olmap.forEachFeatureAtPixel(event.pixel,
            feature => {
                const {values_} = feature;
                if (values_) {
                    popup.show(event.coordinate, `<div><p>GEWASC: ${values_.CAT_GEWASC}</p><p>GEOMETRIE: ${values_.GEOMETRIE_}</p><p>GRE_GEWAS: ${values_.GWS_GEWAS}</p></div>`);
                }
            },
            { layerFilter: (layer) => {
                return (layer.type === new VectorLayer().type) ? true : false;
            }, hitTolerance: 6 }
        );
    });
  }
  componentDidMount() {
    var me = this;
    this.olmap.setTarget("map");   
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
    draw.on('drawend', event => {
      me.setState(prevState=>{
        prevState.showSubmit= true; 
        return prevState
      });
  });
  }
  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    let {initialView} =  this.state;
    if (center === nextState.center && zoom === nextState.zoom && initialView === nextState.initialView) return false;
    return true;
  }
  allowEdit = ()=>{
    
  }
  componentDidUpdate(){
    if(this.state.initialView){
      this.olmap && this.olmap.removeEventListener('pointermove');
    }else{   
      this.updateLegends(this.state.crops);
     popup = new Popup();
     this.olmap.addOverlay(popup);
      this.olmap.removeInteraction(draw);
      this.showPop();
    }
  }
  render() {
    this.updateMap(); 
    return (
      [
      <div id="map" style={{ width: "100%", height: this.props.height+'px' }} key='0'></div>,
  <MapControls key='1' 
    toggleLegends={this.updateLegends} 
    initialView={this.state.initialView} 
    showSubmit={this.state.showSubmit} 
    showResults={this.showResults}
    edit={this.allowEdit}
  />
    ]
    );
  }
}
Map.propTypes = {
  height: PropType.number
}
export default windowDimensions()(Map);
