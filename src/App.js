import "./App.css";

//Router
import { Switch, Route } from "react-router-dom";
//Components
import {
  HomePageContainer,
  CampusContainer,
  StudentContainer,
  AllCampusesContainer,
  AllStudentsContainer,
  NewStudentContainer,
} from './components/containers';
import NewCampusContainer from "./components/containers/NewCampusContainer";
import EditStudentContainer from "./components/containers/EditStudentContainer";
import EditCampusContainer from "./components/containers/EditCampusContainer";
import EnrollNewStudentContainer from "./components/containers/EnrollNewStudentContainer";

// if you create separate components for adding/editing 
// a student or campus, make sure you add routes to those
// components here

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomePageContainer} />
        <Route exact path="/campuses" component={AllCampusesContainer} />
        <Route exact path="/campus/:id" component={CampusContainer} />
        <Route exact path="/editcampus/:id" component={EditCampusContainer} />
        <Route exact path="/newcampus" component={NewCampusContainer} />
        <Route exact path="/students" component={AllStudentsContainer} />
        <Route exact path="/student/:id" component={StudentContainer} />
        <Route exact path="/newstudent" component={NewStudentContainer} />
        <Route exact path="/newstudent/campus/:id" component={EnrollNewStudentContainer}/>
        <Route exact path="/editstudent/:id" component={EditStudentContainer} />
      </Switch>        
    </div>
  );
}

export default App;
