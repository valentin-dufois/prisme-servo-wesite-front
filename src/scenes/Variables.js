import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import EmptyTopic from '../components/EmptyTopic'
import Variable from './Variables/Variable'

class Variables extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      variables: [],
      newVarName: '',
    }
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + '/variables')
      .then(resp => resp.json())
      .then(resp => this.setState(
        {
          loaded: true,
          variables: resp,
        }
      ))
  }

  onNewVarNameChange = e => {
    this.setState({
      newVarName: e.target.value.toUpperCase().replace(/ /g,"_").replace(/[^A-Z_]/gi, ''),
    })
  }

  addVariable = () => {
    const data = new FormData()
    data.append('name', this.state.newVarName)

    fetch(process.env.REACT_APP_API_URL + '/variables', {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(resp => {
        this.setState({
          newVarName: '',
          variables: [...this.state.variables, resp]
        })
      })
  }

  onListUpdate = vars => {
    this.setState({
      variables: vars
    })
  }

  render() {
    if(!this.state.loaded) {
      return <EmptyTopic caption="Variables" />
    }

    return (
      <main className="variables-column">
        { this.state.variables.map(variable => (
          <Variable key={ variable.id } data={ variable } onListUpdate={ this.onListUpdate }/>
        )) }
        <div className="variable-wrapper new-variable">
          <span className="title">Nouvelle variable</span>
          <input type="text"
                 name="name"
                 value={ this.state.newVarName }
                 onChange={ this.onNewVarNameChange }
                 onBlur={ this.save }
                 placeholder="Nom..." />
          <div className="add-variable" onClick={ this.addVariable }>+</div>
        </div>
      </main>
    )
  }
}

export default withRouter(Variables);
