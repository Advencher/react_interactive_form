import React, { Component } from 'react'
import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
 
export default class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: []
        };
    }
 
    handleClose() {
        this.setState({
            open: false
        });
    }
 
    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.props.handleDropzoneChange(files);
        this.setState({
            open: false,
            files: files
        });
    }
 
    handleOpen() {
        this.setState({
            open: true,
        });
    }
 
    render() {
        return (
            <div>
                <Button onClick={this.handleOpen.bind(this)}>
                  Добавте файлы
                </Button>
                <DropzoneDialog
                    open={this.state.open}
                    name="dropzone1"
                    dropzoneText ="Добавте или перетащите файлы"
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={true}
                    maxFileSize={5000000}
                    onClose={this.handleClose.bind(this)}
                />
            </div>
        );
    }
}