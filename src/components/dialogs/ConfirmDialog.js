import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


export default class ConfirmDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
        }
    }

    render() {

    return (
        <Dialog
        open={this.props.open}
        onClose={() => this.props.setOpen(false)}
        aria-labelledby="confirm-dialog"
      >
        <DialogTitle id="confirm-dialog">{this.state.title}</DialogTitle>
        <DialogContent>{this.props.serverResponse}</DialogContent>
        <DialogActions>
          <Button
            //отчистить данные 
            variant="contained"
            onClick={() => this.props.setOpen(false)}
            color="default"
          >
            очистить ввод
          </Button>
          <Button
            //
            variant="contained"
            onClick={() => {
              this.props.setOpen(false);
            }}
            color="secondary"
          >
            продолжить
          </Button>
        </DialogActions>
      </Dialog>          
     )
   
    }


}