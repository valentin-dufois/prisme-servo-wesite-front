import React, {Component} from 'react'
import { withRouter, matchPath } from 'react-router-dom'

class TreeHeader extends Component {
  constructor(props) {
    super(props)

    const match = matchPath(window.location.pathname, {
      path: "/trees/:id"
    });

    this.state = {
      trees: [],
      triggers: [],
      treeID: match !== null ? match.params.id : null,
      desc: null,
      trigger: null,
    }
  }

  componentDidMount() {
    this.refreshTrees().then(() => {
      fetch(process.env.REACT_APP_API_URL + '/triggers')
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            triggers: resp
          })
        })
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const match = matchPath(window.location.pathname, {
        path: "/trees/:id"
      });

      if(match !== null) {
        if(Number(match.params.id) !== Number(this.state.treeID)) {
          // URL was changed externally
          this.refreshTrees().then(() => {
            const tree = this.state.trees.find(tree => Number(match.params.id) === tree.id)
            if (tree) {
              this.setState({
                treeID: tree.id,
                desc: tree.name,
                trigger: tree.trigger_id,
              })
            }
          })
        }
      }
    }
  }

  refreshTrees = () => {
    return fetch(process.env.REACT_APP_API_URL + '/trees')
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          trees: resp
        })
      })
  }

  onTreeChange = e => {
    if(e.target.value === 'new') {
      this.setState({
        treeID: 'new',
        desc: null,
        trigger: null,
      }, () => {
        this.props.history.push('/trees/new')
      })
      return;
    }

    const tree = this.state.trees.find(tree => Number(e.target.value) === tree.id)

    this.setState({
      treeID: tree.id,
      desc: tree.name,
      trigger: tree.trigger_id,
    }, () => {
      this.props.history.push('/trees/' + tree.id)
    })
  }

  onDescUpdate = e => {
    this.setState({
      desc: e.target.value,
    })
  }

  onTriggerUpdate = e => {
    this.setState({
      trigger: e.target.value,
    }, this.save)
  }

  save = () => {
    if(this.state.treeID === null || !isFinite(this.state.treeID))
      return;

    const data = new FormData();
    data.set('_method', 'PUT')
    data.set('name', this.state.desc)
    data.set('trigger', this.state.trigger)

    fetch(process.env.REACT_APP_API_URL + '/trees/' + this.state.treeID, {
      method: 'POST',
      body: data
    })
  }

  render() {
    return (
      <div className="section-header tree-header">
        <select onChange={ this.onTreeChange }
                value={ this.state.treeID || 0 }
                className="tree-id">
          <option value="0" disabled>---</option>
          { this.state.trees.map(tree => (
            <option value={ tree.id } key={ tree.id }>#{ tree.id }</option>
          ))}
          <option value="new">+++</option>
        </select>
        { this.state.treeID !== null && [
          <input className="tree-desc"
                 type="text"
                 value={ this.state.desc || '' }
                 onChange={ this.onDescUpdate }
                 onBlur={ this.save }
                 placeholder={ this.state.treeID !== null ? 'Description de l\'arbre...' : ''}
                 key="tree-desc" />,
          <div className="trigger" key="triggers">
            <label className="trigger-label" htmlFor="trigger-selector">Déclencheur : </label>
            <select className="trigger-selector"
                    id="trigger-selector"
                    name="trigger-selector"
                    value={ this.state.trigger || 0 }
                    onChange={ this.onTriggerUpdate }>
              { this.state.triggers.map(trigger => (
                <option value={ trigger.id }
                        title={ trigger.description }
                        key={ trigger.id }>{ trigger.name }</option>
              ))}
            </select>
          </div>] }
      </div>
    )
  }
}

export default withRouter(TreeHeader);
