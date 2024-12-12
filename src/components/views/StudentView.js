/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Link } from "react-router-dom";

const StudentView = (props) => {
  const { student } = props;

  var campusLink;
  if (student.campusId === "" || student.campusId === null){
    campusLink = <h3>Not Enrolled</h3>;
  } else {
    campusLink = <Link to={`/campus/${student.campus.id}`}><h3>{student.campus.name}</h3></Link>;
  }

  var grade;
  if (student.gpa === "" || student.gpa === null){
    grade = "Not Available";
  } else {
    grade = student.gpa;
  }

  // Render a single Student view 
  return (
    <div>
      <h1>{student.firstname + " " + student.lastname}</h1>
      <img src={student.picture} alt="profile"/>
      {campusLink}
      <h4>Current GPA</h4>
      <h5>{grade}</h5>
      <h4>E-Mail Address</h4>
      <h5>{student.email}</h5>
      <Link to={`/editstudent/${student.id}`}><button>Edit</button></Link>
    </div>
  );

};

export default StudentView;