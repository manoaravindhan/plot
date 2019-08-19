import React,{useState} from "react";
import propTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Edit from "@material-ui/icons/BorderColor";
import Legend from "@material-ui/icons/Category";
import Send from "@material-ui/icons/Send";
import CloudUpload from "@material-ui/icons/CloudUpload";
import FileCopy from "@material-ui/icons/FileCopy";
import Portal from "@material-ui/core/Portal";
import {getElementById} from '../utils/dom';
import UploadModal from "./UploadModal";
import ExportModal from "./ExportModal";
import Legends from './Legends';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  root:{
    display: 'flex',
    alignItems: 'center',
  },
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  controls: {
    position: "absolute",
    top: "2%",
    right: "2%",
    display: "flex",
    flexDirection: "column",
    spacing: theme.spacing.unit
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
});
function MapControls({ classes, toggleLegends, initialView, showResults, edit }) {
  const handleButtonClick = ()=> {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        showResults();
      }, 10000);
    }
  }
  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [openModal, setOpenModal] = useState('');
  const timer = React.useRef();

  return (
    <>
      <div className={classes.controls}>
        <Fab aria-label="Edit" className={classes.fab} onClick={edit}>
          <Edit />
        </Fab>
        <Fab aria-label="upload" className={classes.fab} onClick={()=>setOpenModal('upload')}>
          <CloudUpload />
        </Fab>
        <Fab aria-label="export" className={classes.fab} onClick={()=>setOpenModal('export')}>
          <FileCopy />
        </Fab>  
        {!initialView && <Fab aria-label="legends" className={classes.fab} onClick={()=>setOpenModal('legends')}>
          <Legend />
        </Fab>}
        {initialView && <div className={classes.root}>
        <div className={classes.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          className={success && 'buttonSuccess'}
          onClick={handleButtonClick}
        >
          {<Send />}
        </Fab>
        {loading && <CircularProgress size={68} className={classes.fabProgress} color="secondary"/>}

        </div>
        </div>}

      </div>
      <Portal container={getElementById('modal')}>
      {openModal === 'export' && <ExportModal open={openModal === 'export'} close={()=>setOpenModal('')} title='edit'/>}
      {openModal === 'upload' && <UploadModal open={openModal === 'upload'} close={()=>setOpenModal('')}/>}
        {openModal === 'legends' && <Legends close={()=>setOpenModal('')} toggle={toggleLegends}/>}
      </Portal>
    </>
  );
}
MapControls.propTypes = {
  classes: propTypes.object
};
export default withStyles(styles)(MapControls);
