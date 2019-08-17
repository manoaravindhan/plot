import React,{useState} from "react";
import propTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Edit from "@material-ui/icons/BorderColor";
import CloudUpload from "@material-ui/icons/CloudUpload";
import FileCopy from "@material-ui/icons/FileCopy";
import Portal from "@material-ui/core/Portal";
import {getElementById} from '../utils/dom';
import UploadModal from "./UploadModal";
import ExportModal from "./ExportModal";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  controls: {
    position: "absolute",
    top: "2%",
    right: "2%",
    display: "flex",
    flexDirection: "column",
    spacing: theme.spacing.unit
  }
});
function MapControls({ classes }) {
  const [openModal, setOpenModal] = useState('');
  return (
    <>
      <div className={classes.controls}>
        <Fab aria-label="Edit" className={classes.fab}>
          <Edit />
        </Fab>
        <Fab aria-label="upload" className={classes.fab} onClick={()=>setOpenModal('upload')}>
          <CloudUpload />
        </Fab>
        <Fab aria-label="export" className={classes.fab} onClick={()=>setOpenModal('export')}>
          <FileCopy />
        </Fab>
      </div>
      <Portal container={getElementById('modal')}>
      {openModal === 'export' && <ExportModal open={openModal === 'export'} close={()=>setOpenModal('')}/>}
        {openModal === 'upload' && <UploadModal open={openModal === 'upload'} close={()=>setOpenModal('')}/>}
      </Portal>
    </>
  );
}
MapControls.propTypes = {
  classes: propTypes.object
};
export default withStyles(styles)(MapControls);
