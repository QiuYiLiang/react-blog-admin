import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Login from './Login'
import AdminIndex from './AdminIndex'

const Main = () => {
    return (
        <Router>
            <Route path={'/'} exact component={Login} />
            <Route path={'/index'} exact component={AdminIndex} />
            <Route path={'/index/add'} exact component={AdminIndex} />
            <Route path={'/index/add/:id'} exact component={AdminIndex} />
            <Route path={'/index/list'} exact component={AdminIndex} />
        </Router>
    )
}

export default Main;