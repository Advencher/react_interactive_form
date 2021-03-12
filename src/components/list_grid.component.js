import React, { Component } from "react";
import ApiService from "../services/api.service";
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


export default class GridList extends Component {

    useStyles = makeStyles((theme) => ({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
      },
      image: {
        width: 128,
        height: 128,
      },
      img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
    }));

    classes = this.useStyles();
   
    constructor(props) {
      super(props);
      //this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
      this.retrieveApies = this.retrieveApies.bind(this);
      this.refreshList = this.refreshList.bind(this);
      this.setActiveTutorial = this.setActiveTutorial.bind(this);
      //this.removeAllTutorials = this.removeAllTutorials.bind(this);
      //this.searchTitle = this.searchTitle.bind(this);

      this.state = {
        tutorials: [],
        currentTutorial: null,
        currentIndex: -1,
        searchTitle: ""
      };
      
    }
      
    componentDidMount() {
      this.retrieveApies();
    }
  
    onChangeSearchTitle(e) {
      const searchTitle = e.target.value;
  
      this.setState({
        searchTitle: searchTitle
      });
    }
  
    retrieveApies() {
      ApiService.getAllApies()
        .then(response => {
          this.setState({
            apies: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  
    refreshList() {
      this.retrieveApies();
      this.setState({
        currentItem: null,
        currentIndex: -1
      });
    }
  
    setActiveItem(item, index) {
      this.setState({
        currentTutorial: item,
        currentIndex: index
      });
    }
  
    // removeAllTutorials() {
    //   TutorialDataService.deleteAll()
    //     .then(response => {
    //       console.log(response.data);
    //       this.refreshList();
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // }
  
    searchTitle() {
      TutorialDataService.findByTitle(this.state.searchTitle)
        .then(response => {
          this.setState({
            tutorials: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  
    render() {

          const { apies, currentIndex } = this.state;

          return (<div className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              {apies &&
                apies.map((api, index) => (
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1">
                      {api.api_name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {api.api_url}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {api.response_structure}
                    </Typography>
                    className=
                    {"list-group-item " + (index === currentIndex ? "active" : "")}
                    onClick={() => this.setActiveTutorial(tutorial, index)}
                    key={index}
                    {tutorial.title}
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </div>);
    }
  }