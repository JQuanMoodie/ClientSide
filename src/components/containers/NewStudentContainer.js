/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "",
      email: "",
      gpa: "", 
      campusId: "",
      picture: "", 
      redirect: false, 
      redirectId: null
    };
  }

  componentDidMount() {
    this.props.fetchAllCampuses();
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
    
    if (this.state.firstname === "" || this.state.lastname === "" || this.state.email === ""){
      alert("Please Fill in all required fields");
      return;
    }

    if (this.state.gpa < 0 || this.state.gpa > 4){
      alert("The Student's GPA must be between 0.0 and 4.0");
      return;
    }
  
    var exists = false;
    for (var i = 0; i < this.props.allCampuses.length; i++){
      if (this.props.allCampuses[i].id === Number(this.state.campusId)){
        exists = true;
        break;
      }
    }

    if (this.state.campusId === "" || this.state.campusId === null){
      exists = true;
    }

    if (!exists){
      alert("Please Enter a Valid Campus ID");
      return;
    }

    var url;
    if (this.state.picture === null || this.state.picture === ""){
      url = "https://picsum.photos/id/1/50";
    } else {
      url = this.state.picture;
    }

    let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        campusId: this.state.campusId ? Number(this.state.campusId) : null,
        picture: url,
        email: this.state.email,
        gpa: this.state.gpa ? Number(this.state.gpa) : null
    };
    
    // Add new student in back-end database
    let newStudent = await this.props.addStudent(student);

    // Update state, and trigger redirect to show the new student
    this.setState({
      firstname: "", 
      lastname: "",
      email: "",
      gpa: "", 
      campusId: "",
      picture: "", 
      redirect: true, 
      redirectId: newStudent.id
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit = {this.handleSubmit}      
        />
      </div>          
    );
  }
}

//Map Redux state to props
const mapState = (state) => ({
  allCampuses: state.allCampuses,
});

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(NewStudentContainer);