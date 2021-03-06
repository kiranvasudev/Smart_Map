import React, { Component } from 'react';
import SvgIfcElement from '../../components/SvgIfcElement/SvgIfcElement';
import SvgLayer from '../SvgLayer/SvgLayer';
import styles from './SvgViewPort.css';
import SvgCircle from '../SvgCircle/SvgCircle';
import SvgArrow from '../SvgArrow/SvgArrow';

class SvgViewPort extends Component {

  render(){

    const {selectedSpaceId, routeCoordinates}  = {...this.props};
    const viewBox = this.props.viewBox.join(',');

    const svgLayers = Object.keys(this.props.svgLayers).map((layerType) => {

      const svgIfcElements = this.props.svgLayers[layerType]['elements'].map((ifcElement) => {

        const classes = [ifcElement.ifc_type.slice().replace('Ifc', '')];

        // Find a more effective way of specifically rendering a certain room
        if (ifcElement.global_id === selectedSpaceId) {
          classes.push('SelectedSpace')
        }
        if (this.props.svgLayers[layerType]['isTransparent'] && !(this.props.svgLayers[layerType]['exceptions'].includes(ifcElement.global_id))) {
          classes.push('Transparent')
        }
        return(
        <SvgIfcElement
          key={ifcElement.global_id}
          guid={ifcElement.global_id}
          type={ifcElement.ifc_type}
          path={ifcElement.svg_path}
          clicked={ifcElement.ifc_type === 'IfcSpace' ? this.props.handleClickOnSpace : ()=>{}}
          classes={classes} />
        )
        })
      return (
        <SvgLayer
          key = {layerType}
          styleClass={layerType}
          isTransparent={this.props.svgLayers[layerType]['isTransparent']}>
          {svgIfcElements}
        </SvgLayer>
      );
    });

    if (this.props.currentLocation.show) {
      svgLayers.push(
        <SvgLayer
          key="currentLocation"
          styleClass=''
          isTransparent={false}>
          <SvgCircle x={this.props.currentLocation.x} y={this.props.currentLocation.y} radius={0.5} color="red" />
        </SvgLayer>
      )
    }

    if (routeCoordinates.length > 0) {
      const svgArrows = []
      for(let i = 0; i < routeCoordinates.length - 1; i++){
        svgArrows.push(
          <SvgArrow
          key={i}
          x0={routeCoordinates[i].x}
          y0={routeCoordinates[i].y}
          x1={routeCoordinates[i + 1].x}
          y1={routeCoordinates[i + 1].y}
          color='red'/>
        )
      }
      svgLayers.push(
        <SvgLayer
          key="path"
          styleClass=''
          isTransparent={false}>
          {svgArrows}
        </SvgLayer>
      )
    }

    return (
      <svg
        className={styles.SvgViewPort}
        viewBox={viewBox.length === 0 ? [0, 0, 0, 0] : viewBox}>
        {svgLayers}
      </svg>
    );
  };
}

export default SvgViewPort;

