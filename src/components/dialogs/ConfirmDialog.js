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
            title: props.title
        }
        let randomLoadingAni = this.generateRandomNumber (1, 7);
        this.logo = <img src={`assets/logo${randomLoadingAni}${ (randomLoadingAni === 5 ||randomLoadingAni === 2) ? ".webp" : ".gif"}`} alt="loading..." />;
    }

    generateRandomNumber (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    render() {

    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.setOpen(false)}
        aria-labelledby="confirm-dialog"
      >
        <DialogTitle id="confirm-dialog">{this.state.title}</DialogTitle>

        {
          this.props.isLoading ?  this.logo :  <DialogContent>{this.props.serverResponse}</DialogContent>
        }

        <DialogActions>
          <Button
            //отчистить данные 
            variant="contained"
            onClick={ () => { 
              this.props.clear();
              this.props.setOpen(false);
              this.props.changeLoading(true);
            }
              
            }
            color="default"
          >
            сбросить поля
          </Button>
          <Button
            //
            variant="contained"
            onClick={() => {
              this.props.setOpen(false);
              this.props.changeLoading(true);
            }}
            color="secondary"
          >
            редактировать
          </Button>
        </DialogActions>
      </Dialog>          
     )
   
    }


}