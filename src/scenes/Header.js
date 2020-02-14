import React, {Component} from 'react'
import {Switch, Route, withRouter, matchPath} from 'react-router-dom'
import TreeHeader from './Header/TreeHeader'

class Header extends Component {
  constructor(props) {
    super(props);

    const match = matchPath(window.location.pathname, {
      path: "/:section"
    });

    this.state = {
      section: match !== null ? match.params.section : 'trees'
    }
  }

  onSectionChange = e => {
    const nextSection = e.target.value;

    this.setState({
      section: nextSection,
    }, () => {
      this.props.history.push('/' + nextSection)
    })
  }

  render() {
    return (
      <header>
        <h1>Talkers</h1>
        <select id="section-selector"
                onChange={ this.onSectionChange }
                value={ this.state.section }>
          <option value='trees'>Arbres</option>
          <option value='triggers'>Déclencheurs</option>
          <option value='variables'>Variables</option>
        </select>
        <Switch>
          <Route path="/triggers" />
          <Route path="/variables" />
          <Route component={ TreeHeader }/>
        </Switch>
      </header>
    )
  }
}

export default withRouter(Header);
