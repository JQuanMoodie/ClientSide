/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditStudentView from '../views/EditStudentView';
import { editStudentThunk } from '../../store/thunks';
import { fetchStudentThunk } from "../../store/thunks";

class EditStudentContainer extends Component {
    // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "",
      email: "",
      gpa: "", 
      campusId: "", 
      redirect: false, 
      redirectId: ""
    };
  }

  componentDidMount() {
    //getting student ID from url
    this.props.fetchStudent(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    // Update state with fetched student data once it's available
    if (prevProps.student !== this.props.student) {
      const { firstname, lastname, email, gpa, campusId } = this.props.student;
      this.setState({ firstname, lastname, email, gpa, campusId });
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
    
    if (this.state.firstname === ""){
      alert("Please Input The Student's First Name");
      return;
    }
    if (this.state.lastname === ""){
      alert("Please Input The Student's Last Name");
      return;
    }
    if (this.state.email === ""){
      alert("Please Input The Student's E-Mail Address");
      return;
    }

    let student = {
        id: this.props.match.params.id,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        campusId: this.state.campusId,
        email: this.state.email,
        gpa: this.state.gpa
    };
    
    // edit student in back-end database
    var updatedStudent = await this.props.editStudent(student);
    updatedStudent.id = student.id;

    // Update state, and trigger redirect to show the new student
    this.setState({
      redirect: true, 
      redirectId: updatedStudent.id
    });
  };

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render edit student input form
  render() {
    // Redirect to edited student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditStudentView 
            student={this.state}
            handleChange = {this.handleChange} 
            handleSubmit = {this.handleSubmit}      
        />
      </div>          
    );
  }
}

//Map Redux state to props
const mapState = (state) => ({
    student: state.student,
});

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        editStudent: (student) => dispatch(editStudentThunk(student)),
        fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);