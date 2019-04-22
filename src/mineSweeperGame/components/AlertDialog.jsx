import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from "@material-ui/core";

const styles = {
    dialogPaper: {
        minHeight: '20vh',
        maxHeight: '40vh',
        minWidth: "30vw",
        maxWidth: "50vw",
        backgroundColor:"white",
        opacity:"0.6",
        border:"double",
        borderWidth:"4px",
        textAlign:"center"
    },
};

@withStyles(styles)
class AlertDialog extends React.Component {

    render() {
        const {text,title}=this.props
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    classes={{paper: this.props.classes.dialogPaper}}
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={this.props.dialog} id="alert-dialog-description">
                          {text}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleOk} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default AlertDialog;