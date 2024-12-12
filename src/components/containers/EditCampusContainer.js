/*==================================================
EditCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditCampusView from '../views/EditCampusView';
import { editCampusThunk } from '../../store/thunks';
import { fetchCampusThunk } from "../../store/thunks";

class EditCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
        name: "",
        address: "",
        description: "",
        redirect: false, 
        redirectId: ""
    }; 
  }

  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    // Update state with fetched student data once it's available
    if (prevProps.campus !== this.props.campus) {
      const { name, address, description } = this.props.campus;
      this.setState({ name, address, description });
    }
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.
    
    if (this.state.name === ""){
      alert("Please Input The University's Name");
      return;
    }
    if (this.state.address === ""){
      alert("Please Input The Campus's Adddess");
      return;
    }

    let campus = {
        id: this.props.match.params.id,
        name: this.state.name,
        address: this.state.address,
        description: this.state.description
    };
    
    // edit campus in back-end database
    let updatedCampus = await this.props.editCampus(campus);
    updatedCampus.id = campus.id;

    // Update state, and trigger redirect to show the new Campus
    this.setState({
        redirect: true, 
        redirectId: updatedCampus.id
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new Campus input form
  render() {
    // Redirect to new Campus's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditCampusView 
            campus={this.state}
            handleChange = {this.handleChange} 
            handleSubmit = {this.handleSubmit}      
        />
      </div>          
    );
  }
}

//Map Redux state to props
const mapState = (state) => ({
    campus: state.campus,
});

// The following input argument is passed to the "connect" function used by "NewCampusContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        editCampus: (campus) => dispatch(editCampusThunk(campus)),
        fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
    })
}

// Export store-connected container by default
// EditCampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);