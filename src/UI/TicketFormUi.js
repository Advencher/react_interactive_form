import React from 'react'
import Autocomplete from "@material-ui/lab/Autocomplete";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import { StyledButton } from "../components/custom/customCompnents";
import { Alert, AlertTitle } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { Gluejar } from '@charliewilco/gluejar';
import { makeStyles } from "@material-ui/core/styles";
import Dropzone from "../components/dialogs/Dropzone";


const classes = makeStyles((theme) => ({
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



const TicketFormUi = (props) => {
return (
      <div id="main-div" style={{ padding: 16, margin: "auto", maxWidth: 900 }}>
        <form
          className={classes.form}
          autoComplete="off"
          display="flex"
          onSubmit={props.handleSubmit} //bind.(this)
        >
          <TextField
            id="ticket_name"
            name="name"
            label="Наименование задачи/тикета"
            variant="outlined"
            margin="normal"
            color="secondary"
           // inputRef={(el, props) => (props.ticket_name_ref = el)}
            inputRef={props.ticket_name_ref}
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
            //inputRef={(el, props) => (props.from_who_ref = el)}
            inputRef={props.from_who_ref}
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
            //inputRef={(el, props) => (props.feedback_email_ref = el)}
            inputRef={props.feedback_email_ref}
            required
          />

          {props.alertCapcha.state ? (
            <Alert
              severity="warning"
              onClose={(props) => {
                props.hideAlert();
                }}
            >
              {" "}
              <AlertTitle>{props.alertCapcha.message}</AlertTitle>{" "}
            </Alert>
          ) : null}

          <Autocomplete
            options={props.organizations.items}
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
            options={props.projects.items}
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
            //inputRef={(el, props) => (props.ticket_description_ref = el)}
            inputRef={props.ticket_description_ref}
            required
          />

          <Dropzone
            handleDropzoneChange={props.handleDropzoneChange} //bind.this
          ></Dropzone>

          <ConfirmDialog
            clear={props.clearTextFields}
            isLoading={props.isLoading} //control loading spinner
            changeLoading={props.changeLoading} //bind.this
            title="Ответ сервера"
            type="submit"
            files={props.files}
            serverResponse={props.response}
            open={props.confimOpen}
            setOpen={props.setConfirmOpen} //.bind(this)
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

export default TicketFormUi