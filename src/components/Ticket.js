import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import Dropzone from "./dialogs/Dropzone";
import { makeStyles } from "@material-ui/core/styles";
import ApiProjeqtor from "../services/api.service.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import { StyledButton } from "./custom/customCompnents";

export default class TicketForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      confimOpen: false,
      response: [],
    };
  }

  classes = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),

      //  alignItems: 'center',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    textfields: {
      color: "black",
    },
  }));

  async componentDidMount() {
  let cookie = await ApiProjeqtor.getProjeqtorCookie();
  let projects = await ApiProjeqtor.getAllProjects();

    this.setState({
    projects: projects.items,
    loading: false,
    files: [],
    });
  }

  handleDropzoneChange(files) {
    this.setState({ files: files });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setConfirmOpen(true);
    const form = event.target;
    const data = new FormData(form);
    let newdata = new FormData();
    let object = {};
    data.forEach((value, key) => (object[key] = value));
    object["idTicketType"] = 17;
    object["idStatus"] = 1;
    this.state.projects.forEach((project) => {
      if (project.name === object.nameProject) {
        object["idProject"] = project.id;
      }
    });
    let jsonData = JSON.stringify(object);
    //console.log(jsonData);
    newdata.append("data", jsonData);
    let response = await ApiProjeqtor.postNewTicket(newdata, "Ticket");
    this.setState({ response: response });
    ApiProjeqtor.uploadFile(this.state.response, this.state.files);
  }

  setConfirmOpen(open) {
    this.setState({ confimOpen: open });
  }

  render() {
    return (
      <div id="main-div" style={{ padding: 16, margin: "auto", maxWidth: 900 }}>
        <form
          className={this.classes.form}
          //noValidate
          autoComplete="off"
          display="flex"
          onSubmit={this.handleSubmit.bind(this)}
        >
          <TextField
            id="ticket-name"
            name="name"
            label="Наименование задачи/тикета"
            variant="outlined"
            margin="normal"
            color="secondary"
            fullWidth
            required
          />

          <TextField
            id="from_who"
            name="who"
            label="ФИО и департамент"
            variant="outlined"
            margin="normal"
            fullWidth
            align="center"
            required
          />

          <Autocomplete
            //onChange={(_, projects) => getMakes(projects)}
            options={this.state.projects}
            margin="dense"
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                id="ticket-project"
                name="nameProject"
                margin="normal"
                label="Проект"
                variant="outlined"
                //required
              />
            )}
          />

          <TextField
            id="ticket-description"
            name="description"
            label="Описание проблемы/бага"
            variant="outlined"
            fullWidth
            rows={20}
            multiline={true}
            align="center"
            margin="normal"
            required
          />

          <Dropzone
            handleDropzoneChange={this.handleDropzoneChange.bind(this)}
          ></Dropzone>

          <ConfirmDialog
            title="Ответ от projqtor"
            type="submit"
            serverResponse={this.state.response}
            open={this.state.confimOpen}
            setOpen={this.setConfirmOpen.bind(this)}
          >
            Подтвердите отправку
          </ConfirmDialog>

          <StyledButton
            type="submit"
            aria-label="Отправить тикет"
            id="submit_ticket"
            onClick={() => this.setConfirmOpen(true)}
          >
            {" "}
            Отправить{" "}
          </StyledButton>
        </form>
      </div>
    );
  }
}
