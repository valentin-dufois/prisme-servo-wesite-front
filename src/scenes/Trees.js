import React, {Component} from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'
import NewTree from './Trees/NewTree'
import EmptyTopic from '../components/EmptyTopic'
import Tree from './Trees/Tree'

class Trees extends Component {
  render() {
    return (
      <Switch>
        <Route path="/trees/new" component={NewTree} />
        <Route path="/trees/:id" component={Tree} />
        <Route>
          <EmptyTopic caption="Arbres" />
        </Route>
      </Switch>
    )
  }
}

export default withRouter(Trees);