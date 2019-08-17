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

const styles = {
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  })
}
const styleFunction = feature=> styles[feature.getGeometry().getType()];
const geoJsonObject = geo;
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { center: [635047.1775508502, 6897943.454034535], zoom: 12 };
    Proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
    register(Proj4);
    const vectorSource = new VectorSource({
          features: (new GeoJSON({
            dataProjection: 'EPSG:28992',
            featureProjection: 'EPSG:3857'
      
          })).readFeatures(geoJsonObject)
        });
        vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));
        const vectorLayer = new VectorLayer({
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
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  componentDidMount() {
    this.olmap.setTarget("map");   
     var popup = new Popup();
      this.olmap.addOverlay(popup);
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
    this.olmap.on('pointermove', (event) => {
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

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  render() {
    this.updateMap(); 
    return (
      [
      <div id="map" style={{ width: "100%", height: this.props.height+'px' }} key='0'></div>,
      <MapControls key='1'/>
    ]
    );
  }
}
Map.propTypes = {
  height: PropType.number
}
export default windowDimensions()(Map);
