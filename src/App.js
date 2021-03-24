import React, { Fragment } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Navbar from "./components/Navbar";
import {CssBaseline,withStyles,} from '@material-ui/core';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import  Ticket from './components/Ticket.js';
import DataSourceWrapperHoc from "./services/DataSourceWrapperHoc";

const styles = theme => ({
  main: {
    backgroundColor: "",
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
    <CssBaseline />
    <AppHeader />
  <BrowserRouter basename='/react'>
  <Navbar />
  <div className="container mt-2" style={{ marginTop: 40 }}>
    <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/new_ticket" component= { DataSourceWrapperHoc } />
    <Route path="*" render={() => "404 Not found!"} />
  </Switch>
  </div>
  </BrowserRouter>
  </Fragment>
);

export default withStyles(styles)(App);
