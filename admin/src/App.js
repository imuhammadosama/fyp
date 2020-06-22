import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./config/routes.config";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import AddMember from "./components/pages/members/Add";
import ViewMembers from "./components/pages/members/View";
import AddGuard from "./components/pages/guards/Add";
import ViewGuards from "./components/pages/guards/View";
import AddDriver from "./components/pages/drivers/Add";
import ViewDrivers from "./components/pages/drivers/View";
import UpdateDriver from "./components/pages/drivers/Update";
import DriverRides from "./components/pages/drivers/Rides";
import UpdateMember from "./components/pages/members/Update";
import UpdateGuard from "./components/pages/guards/Update";
import Alerts from "./components/pages/Alert";
import PreviousRide from "./components/pages/drivers/PreviousRide";
import TrackActiveRide from "./components/pages/drivers/TrackActiveRide";
import ViewWorkers from "./components/pages/workers/View";
import WorkerServices from "./components/pages/workers/WorkerServices";
import MemberServices from "./components/pages/members/MemberServices";
import ViewServices from "./components/pages/services/View";

function App() {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <PublicRoute path="/login">
          <Login />
        </PublicRoute>

        {/* Private Routes */}
        <PrivateRoute exact path="/">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute exact path="/members/add">
          <AddMember />
        </PrivateRoute>
        <PrivateRoute exact path="/members/view">
          <ViewMembers />
        </PrivateRoute>
        <PrivateRoute exact path="/member/:id/update">
          <UpdateMember />
        </PrivateRoute>
        <PrivateRoute exact path="/member/:id">
          <MemberServices />
        </PrivateRoute>

        <PrivateRoute exact path="/drivers/add">
          <AddDriver />
        </PrivateRoute>
        <PrivateRoute exact path="/drivers/view">
          <ViewDrivers />
        </PrivateRoute>
        <PrivateRoute exact path="/driver/:id/update">
          <UpdateDriver />
        </PrivateRoute>
        <PrivateRoute exact path="/driver/:id/rides">
          <DriverRides />
        </PrivateRoute>
        <PrivateRoute exact path="/driver/:id/ride">
          <PreviousRide />
        </PrivateRoute>
        <PrivateRoute exact path="/driver/:id/track">
          <TrackActiveRide />
        </PrivateRoute>

        <PrivateRoute exact path="/guards/add">
          <AddGuard />
        </PrivateRoute>
        <PrivateRoute exact path="/guards/view">
          <ViewGuards />
        </PrivateRoute>
        <PrivateRoute exact path="/guard/:id/update">
          <UpdateGuard />
        </PrivateRoute>

        <PrivateRoute exact path="/workers/view">
          <ViewWorkers />
        </PrivateRoute>
        <PrivateRoute exact path="/worker/:id">
          <WorkerServices />
        </PrivateRoute>

        <PrivateRoute exact path="/alerts">
          <Alerts />
        </PrivateRoute>

        <PrivateRoute exact path="/services">
          <ViewServices />
        </PrivateRoute>

        {/* Default Route i.e. Page not found */}
        <Route render={() => "Page not found!"} />
      </Switch>
    </Router>
  );
}

export default App;
