import React, {Component} from 'react'

class Variables extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: this.props.values,
    }
  }

  insertVariable = () => {
    this.setState({
      values: [...this.state.values, 0]
    })
  }

  onVarChange = (index, e) => {
    const values = this.state.values
    values[index] = e.target.value

    this.setState({
      values: values,
    }, this.props.save())
  }

  erase = index => {
    const values = this.state.values
    values.splice(index, 1);

    this.setState({
      values: values,
    }, this.props.save())
  }

  render() {
    return (
      <div className="variables">
        { this.state.values.map((val, i) => (
          <div className="variable" key={ i + '-' + val.id }>
            <select name={ this.props.name }
                    value={ val.id }
                    onChange={ this.onVarChange.bind(this, i) }>
              <option value="0" disabled>---</option>
              { this.props.variables.map(variable => (
                <option value={ variable.id } key={ variable.id }>{ variable.name }</option>
              )) }
            </select>
            <div className="erase-btn"
                 onClick={ this.erase.bind(this, i) }>x</div>
          </div>
        )) }
        <div className="add-variable" onClick={ this.insertVariable }>+</div>
      </div>
    )
  }
}

export default Variables;