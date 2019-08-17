import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Divider from "@material-ui/core/Divider";
import { DropzoneArea } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import '../styles/dropzone.scss';

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  position: {
    margin: "auto"
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  formControl: {
    margin: "auto",
    minWidth: 120,
    width: "50%"
  },
  button: {
    margin: theme.spacing.unit
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  actionBar: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px'
  }
});

const UploadModal = ({ classes, open, close }) => {
  const [files,setFiles] = useState([]);
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      className={classes.position}
    >
      <div className={classes.paper}>
        <Typography variant="h6" align="center">
          Upload Parameters
        </Typography>
        <Divider />
        <Typography paragraph align="center">
          Upload a file to lock down an area or region you wish to look or analyse
        </Typography>
        <DropzoneArea 
                    onChange={()=>setFiles(files)} 
                    acceptedFiles={['image/*', 'application/json']}
                    filesLimit={1}
                    showPreviewsInDropzone
                    dropzoneText='Drop file here to upload. (File types accepted: XLS, PDF and CSV)'
                    dropzoneParagraphClass='dropzone-para'
        
        />
        <div className={classes.actionBar}>
        <Button variant="contained" className={classes.button} onClick={close}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" className={classes.button}>
          Upload
        </Button>
        </div>
      </div>
    </Modal>
  );
};

UploadModal.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  close: PropTypes.func
};

export default withStyles(styles)(UploadModal);
