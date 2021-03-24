import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import Dropzone from "./dialogs/Dropzone";
import { makeStyles } from "@material-ui/core/styles";
import ApiProjeqtor from "../services/api.service.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import { StyledButton } from "./custom/customCompnents";
//import ReCAPTCHA from "react-google-recaptcha";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Gluejar } from '@charliewilco/gluejar'


//MY DOGSHIT CODE - need to separate logic from presentation code
//possible solutions - wrap state less component with logic components 
//a lot to do

const omegaSecret = "6LcXI4QaAAAAAMhnD5h1XYGSW44jEQw-2CyrV0R9";
export default class TicketForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      confimOpen: false,
      response: "",
      isLoading: true,
      files: [],
      capchaToken: "",
      isHuman: false,
      alertCapcha: {
        state: false,
        message: "",
      },
    };
    this.captchaDemo = null;
    this.clearTextFields = this.clearTextFields.bind(this);
    this.onChangeCapcha = this.onChangeCapcha.bind(this);
  }

  defaultState = () => {
    this.setState({
      confimOpen: false,
      response: "",
      isLoading: true,
      files: [],
    });
  };

  clearTextFields = () => {
    this.defaultState();
    this.ticket_description.value = "";
    this.ticket_name.value = "";
    this.from_who.value = "";
    this.feedback_email.value = "";
  };

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
      width: "100%",
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    textfields: {
      color: "black",
    },
  }));

  onChangeCapcha(value) {
    this.setState({ capchaToken: value });
    if (value !== null)
      this.setState({
        isHuman: ApiProjeqtor.validateHuman(omegaSecret, value),
      });
  }

  async componentDidMount() {
    let projects = await ApiProjeqtor.getList("Project");
    let organizations = await ApiProjeqtor.getList("Organization");

    this.setState({
      projects: projects.items,
      organizations: organizations.items,
    });
  }

  changeLoading(loadingState) {
    this.setState({ isLoading: loadingState });
  }

  handleDropzoneChange(files) {
    this.setState({ files: files });
  }

  validateEmail(email) {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      this.setState({
        alertCapcha: {
          message: "Неправильный формат email",
          state: true,
        },
      });
      return false;
    } else return true;
  }

  async handleSubmit(event) {
    event.preventDefault();

    // if (this.state.capchaToken === "") {
    //   //TO DO: MAKE EM VALIDATE RRRAGE
    //   this.setState( {alertCapcha: {
    //     message: "Подвердите, что вы не робот. Только честно.",
    //     state: true
    //   }});
    //   return;
    // }
    // else if (this.state.isHuman === false) {
    //   //TO DO: MAKE EM VALIDATE RRRAGE
    //   this.setState( {alertCapcha: {
    //     message: "ROBOT DETECTED EXECUTING SELF DESTRUCT PROTOCOL #0069",
    //     state: true
    //   }});
    //   return;
    // }
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
    if (!this.validateEmail(object.feedbackemail)) return; //если неправильный email
    object.description = `Подразделение: ${object.nameOrganization}\n\nАвтор тикета: ${object.who}\n\n ${object.description}`;
    let jsonData = JSON.stringify(object);
    newdata.append("data", jsonData);
    this.setConfirmOpen(true);
    let response = await ApiProjeqtor.postNewTicket(
      newdata,
      "Ticket",
      this.state.files
    );
    this.setState({ response: JSON.stringify(response) });
    this.changeLoading(false);
  }

  setConfirmOpen(open) {
    this.setState({ confimOpen: open });
  }

  render() {
    return (
      <div id="main-div" style={{ padding: 16, margin: "auto", maxWidth: 900 }}>
        <form
          className={this.classes.form}
          autoComplete="off"
          display="flex"
          onSubmit={this.handleSubmit.bind(this)}
        >
          <TextField
            id="ticket_name"
            name="name"
            label="Наименование задачи/тикета"
            variant="outlined"
            margin="normal"
            color="secondary"
            inputRef={(el) => (this.ticket_name = el)}
            fullWidth
            required
          />

          <TextField
            id="from_who"
            name="who"
            label="Введите ФИО"
            variant="outlined"
            margin="normal"
            fullWidth
            inputRef={(el) => (this.from_who = el)}
            align="center"
            required
          />

          <TextField
            id="feedback_email"
            name="feedbackemail"
            label="Email для обратной связи"
            variant="outlined"
            fullWidth
            align="center"
            margin="normal"
            inputRef={(el) => (this.feedback_email = el)}
            required
          />

          {this.state.alertCapcha.state ? (
            <Alert
              severity="warning"
              onClose={() => {
                this.setState({
                  alertCapcha: {
                    message: "",
                    state: false,
                  },
                });
              }}
            >
              {" "}
              <AlertTitle>{this.state.alertCapcha.message}</AlertTitle>{" "}
            </Alert>
          ) : null}

          <Autocomplete
            options={this.state.organizations}
            margin="dense"
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                id="ticket_organization"
                name="nameOrganization"
                margin="normal"
                label="Подразделение/департамент/локация"
                variant="outlined"
                required
              />
            )}
          />

          <Autocomplete
            options={this.state.projects}
            margin="dense"
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                id="ticket_project"
                name="nameProject"
                margin="normal"
                label="Проект"
                variant="outlined"
                required
              />
            )}
          />

          <TextField
            id="ticket_description"
            name="description"
            label="Описание проблемы/бага"
            variant="outlined"
            fullWidth
            rows={20}
            multiline={true}
            align="center"
            margin="normal"
            inputRef={(el) => (this.ticket_description = el)}
            required
          />

          <Dropzone
            handleDropzoneChange={this.handleDropzoneChange.bind(this)}
          ></Dropzone>

          <ConfirmDialog
            clear={this.clearTextFields}
            isLoading={this.state.isLoading} //control loading spinner
            changeLoading={this.changeLoading.bind(this)}
            title="Ответ сервера"
            type="submit"
            files={this.state.files}
            serverResponse={this.state.response}
            open={this.state.confimOpen}
            setOpen={this.setConfirmOpen.bind(this)}
          >
            Подтвердите отправку
          </ConfirmDialog>

          {/* <ReCAPTCHA
            sitekey={omegaSecret}
            ref={ (el) => {this.captchaDemo = el;}}
            theme="dark"
            onChange={this.onChangeCapcha}
          /> */}

          <StyledButton
            type="submit"
            aria-label="Отправить тикет"
            id="submit_ticket"
          >
            {" "}
            Отправить{" "}
          </StyledButton>
        </form>
      </div>
    );
  }
}
