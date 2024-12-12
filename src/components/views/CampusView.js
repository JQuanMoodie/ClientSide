/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus} = props;
  
  var studentList = <h4>Students Currently Enrolled</h4>;
  if (campus.students.length === 0){
    studentList = <h4>There Are Currently No Students Enrolled</h4>
  }
    
  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      <img src={campus.picture} alt="building"/>
      <h5>{campus.address}</h5>
      <p>{campus.description}</p>
      <Link to={`/editcampus/${campus.id}`}><button>Edit</button></Link>
      {studentList}
      {campus.students.map( student => {
        let name = student.firstname + " " + student.lastname;
        return (
        <div key={student.id}>
          <Link to={`/student/${student.id}`}>
            <h2>{name}</h2>
          </Link>             
        </div>
        );
      })}
    </div>
  );
};

export default CampusView;