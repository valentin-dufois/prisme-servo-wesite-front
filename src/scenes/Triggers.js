import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import EmptyTopic from '../components/EmptyTopic'
import Trigger from './Triggers/Trigger'

class Triggers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      triggers: [],
      newTriggerName: '',
    }
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + '/triggers')
      .then(resp => resp.json())
      .then(resp => this.setState({
        loaded: true,
        triggers: resp,
      }))
  }

  onNewTriggerNameChange = e => {
    this.setState({
      newTriggerName: e.target.value,
    })
  }

  addTrigger = () => {
    const data = new FormData()
    data.append('name', this.state.newTriggerName)

    fetch(process.env.REACT_APP_API_URL + '/triggers', {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(resp => {
        this.setState({
          newTriggerName: '',
          triggers: [...this.state.triggers, resp]
        })
      })
  }

  onListUpdate = vars => {
    this.setState({
      triggers: vars
    })
  }

  render() {
    if(!this.state.loaded) {
      return <EmptyTopic caption="Triggers" />
    }

    return (
      <main className="triggers-column">
        { this.state.triggers.map(trigger => (
          <Trigger key={ trigger.id } data={ trigger } onListUpdate={ this.onListUpdate }/>
        )) }
        <div className="trigger-wrapper new-trigger">
          <span className="title">Nouveau déclencheur</span>
          <input type="text"
                 name="name"
                 value={ this.state.newTriggerName }
                 onChange={ this.onNewTriggerNameChange }
                 onBlur={ this.save }
                 placeholder="Nom..." />
          <div className="add-trigger" onClick={ this.addTrigger }>+</div>
        </div>
      </main>
    )
  }
}

export default withRouter(Triggers);
