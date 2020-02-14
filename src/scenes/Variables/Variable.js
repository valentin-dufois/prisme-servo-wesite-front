import React, {Component} from 'react'
import TextareaAutosize from 'react-textarea-autosize'

class Variable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.data.id,
      name: this.props.data.name,
      desc: this.props.data.description,
      formRef: React.createRef(),
    }
  }

  onNameChange = e => {
    this.setState({
      name: e.target.value.toUpperCase().replace(/[^A-Z_]/gi, ''),
    })
  }

  onDescChange = e => {
    this.setState({
      desc: e.target.value,
    })
  }

  save = () => {
    const data = new FormData(this.state.formRef.current)
    data.append('_method', 'PUT')

    fetch(process.env.REACT_APP_API_URL + '/variables/' + this.state.id, {
      method: 'POST',
      body: data,
    })
  }

  onRemove = () => {
    const data = new FormData()
    data.append('_method', 'DELETE')

    fetch(process.env.REACT_APP_API_URL + '/variables/' + this.state.id, {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(this.props.onListUpdate)
  }

  render() {
    return (
      <div className="variable-wrapper">
        <span className="title">Variable</span>
        <div className="erase-btn" onClick={ this.onRemove }>x</div>
        <form ref={ this.state.formRef }>
          <input type="text"
                 name="name"
                 value={ this.state.name }
                 onChange={ this.onNameChange }
                 onBlur={ this.save }
                 placeholder="Nom..." />
          <TextareaAutosize
                name="desc"
                value={ this.state.desc || '' }
                onChange={ this.onDescChange }
                onBlur={ this.save }
                placeholder="Description..." />
        </form>
      </div>
    )
  }
}

export default Variable;
