import React from "react";
import Util from "../utils/Util";
import  TicketFormUi  from "./TicketFormUi";


export default class UiFormController extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      projects: props.data.get("projects"),
      organizations: props.data.get("organizations"),
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
    this.clearTextFields = this.clearTextFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.ticket_description = React.createRef();
    this.ticket_name = React.createRef();
    this.from_who = React.createRef();
    this.feedback_email = React.createRef();
    //this.onChangeCapcha = this.onChangeCapcha.bind(this);
    console.log(this.state.projects);
    console.log(this.state.organizations);
    
  }

  changeLoading = (loadingState) => this.setState({ isLoading: loadingState });

  handleDropzoneAddFiles = (files) =>
    this.setState({ files: [...this.state.files, ...files] });

  showAlert = (message) =>
    this.setState({ alertCapcha: { message: message, state: true } });

  hideAlert = () =>
    this.setState({ alertCapcha: { message: "", state: false } });

  clearTextFields = () => {
    this.defaultState();
    this.ticket_description.current.value = "";
    this.ticket_name.current.value = "";
    this.from_who.current.value = "";
    this.feedback_email.current.value = "";
  };

  emailFormatChecker = (email) => { 
    if(!Util.validateEmail(email))  this.showAlert("Неправильный формат Email");
    return false;
  };

  defaultState = () => {
    this.setState({
      confimOpen: false,
      response: "",
      isLoading: true,
      files: [],
    });
  };

  changeLoadingState = (loadingState) => this.setState({ isLoading: loadingState });
  
  setConfirmOpen = (open) => this.setState({ confimOpen: open });
  
  changeLoading = (loadingState) => this.setState({ isLoading: loadingState });
  
  handleSubmit (event) {
    event.preventDefault();
    console.log("Submit here");
  }

  render() {
    return (
      <TicketFormUi
        projects={this.state.projects}
        organizations={this.state.organizations}
        handleSubmit={this.handleSubmit}
        isLoading={this.state.isLoading}
        setConfirmOpen={this.setConfirmOpen}
        showAlert={this.showAlert}
        hideAlert={this.hideAlert}
        setOpen={this.setConfirmOpen}
        open={this.state.confimOpen}
        response={this.response}
        clear={this.clearTextFields}
        ticket_description_ref = {this.ticket_description}
        ticket_name_ref = {this.ticket_name}
        from_who_ref = {this.from_who}
        feedback_email_ref = {this.feedback_email}
        alertCapcha = {this.state.alertCapcha}
      />
    );
  }
}