import React, { Component } from "react";
import DataSource from "./api.service.js";
import UiFormController from "../UI/UiFormController";

const TicketFormWithSubscription = withSubscription(
    UiFormController,
    (DataSource) => DataSource.getMap() // вернусть все списки листов
  );
  
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
    // ...and returns another component...
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
          isFetching: false,
          data: selectData(DataSource, props) //DataSource.getMap()
        };     
      }
  
      componentDidMount() {
        // ... that takes care of the subscription...
        
      }
  
      componentWillUnmount() {
        
      }
  
      handleChange() {
        this.setState({
          data: selectData(DataSource, this.props)
        });
      }
  
      render() {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return <WrappedComponent data={this.state.data} {...this.props} />;
      }
    };
  }

  export default TicketFormWithSubscription;