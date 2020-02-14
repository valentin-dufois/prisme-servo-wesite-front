import React, {Component} from 'react'
import Out from './Out'
import Variables from './Variables'
import TextareaAutosize from 'react-textarea-autosize'

class Behaviour extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: this.props.data.action,
      code: this.props.data.action_code,
      outs: this.props.data.outs,
      forceStart: this.props.data.force_start,
    }

    this.behaviourRef = React.createRef();
  }

  onForceStartChange = e => {
    this.setState({
      forceStart: e.target.checked
    }, this.save)
  }

  onActionChange = e => {
    this.setState({
      action: e.target.value
    })
  }

  onActionCodeChange = e => {
    this.setState({
      code: e.target.value
    })
  }

  save = () => {
    const data = new FormData(this.behaviourRef.current);
    data.append('_method', 'PUT')

    fetch(process.env.REACT_APP_API_URL + '/behaviours/' + this.props.data.id, {
      method: 'POST',
      body: data
    })
  }

  insertOut = () => {
    const data = new FormData();
    data.append('behaviour', this.props.data.id)
    data.append('condition', '')

    fetch(process.env.REACT_APP_API_URL + '/outs', {
      method: 'POST',
      body: data
    }).then(resp => resp.json())
      .then(resp => this.setState({
        outs: [...this.state.outs, resp]
    }))
  }

  insertBehaviour = outID => {
    const data = new FormData();
    data.append('tree', this.props.data.tree_id)
    data.append('out', outID)

    fetch(process.env.REACT_APP_API_URL + '/behaviours', {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(resp => this.props.updateTree(resp))
  }

  setBehaviour = (outID, behaviourID) => {
    const data = new FormData();
    data.append('next', behaviourID)

    fetch(process.env.REACT_APP_API_URL + '/outs/' + outID + '/set-next', {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(this.props.updateTree)
  }

  removeNextBehaviour = (outID) => {

    fetch(process.env.REACT_APP_API_URL + '/outs/' + outID + '/remove-next')
      .then(resp => resp.json())
      .then(this.props.updateTree)
  }

  removeBehaviour = () => {
    const data = new FormData();
    data.append('_method', 'DELETE')

    fetch(process.env.REACT_APP_API_URL + '/behaviours/' + this.props.data.id, {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(this.props.updateTree)
  }

  render() {
    return (
      <div className="behaviour">
        <details className="behaviour-head">
          <summary className="behaviour-id">Comportement #{ this.props.data.id }</summary>
          <form ref={ this.behaviourRef }>
            { this.props.data.tree_order !== 0 &&
              this.state.outs.length === 0 &&
              <div className="remove-btn remove-behaviour"
                 onClick={ this.removeBehaviour }>x</div> }
            { this.props.data.tree_order === 0 && (
              <div className="force-start-btn">
                <input type="checkbox"
                       name="forceStart"
                       checked={ this.state.forceStart }
                       onChange={ this.onForceStartChange }
                       id={ 'force-start-checkbox-' + this.props.data.id }/>
                 <label htmlFor={ 'force-start-checkbox-' + this.props.data.id }>
                   { this.state.forceStart ? 'Forcer le démarrage' : 'Ne pas forcer le démarrage' }
                 </label>
              </div>
            )}
            <details className="inputs">
              <summary>Variables d'entrée</summary>
              <Variables name="inputs"
                         values={ this.props.data.inputs }
                         variables={ this.props.variables }
                         save={ this.save }/>
            </details>
            <TextareaAutosize name="action"
                      className="behaviour-action"
                      placeholder="Pas d'action"
                      value={ this.state.action || ''}
                      onChange={ this.onActionChange }
                      onBlur={ this.save }/>
            <details className="behaviour-code-wrapper">
              <summary>Code</summary>
              <TextareaAutosize name="action_code"
                                className="behaviour-code"
                                placeholder="Non validé..."
                                value={ this.state.code || ''}
                                onChange={ this.onActionCodeChange }
                                onBlur={ this.save }/>
            </details>
          </form>
        </details>
        <div className="outs-row">
          { this.state.outs.map((out, i) => (
            <Out data={ out }
                 key={ out.id + 'i' + out.next_behaviour }
                 insertBehaviour={ this.insertBehaviour }
                 updateTree={ this.props.updateTree }
                 variables={ this.props.variables }
                 setBehaviour={ this.setBehaviour }
                 removeNextBehaviour={ this.removeNextBehaviour } />
          )) }
          <div className="new-out" onClick={ this.insertOut }><div>+</div></div>
        </div>
      </div>
    )
  }
}

export default Behaviour;
