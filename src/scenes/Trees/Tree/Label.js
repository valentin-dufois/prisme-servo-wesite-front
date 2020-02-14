import React, {Component} from 'react'
import TextareaAutosize from 'react-textarea-autosize'

class Label extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.data.lang,
      text: this.props.data.text,
    }
  }

  onTextChange = e => {
    this.setState({
      text: e.target.value,
    })
  }

  onLangChange = e => {
    this.setState({
      lang: e.target.value
    }, this.save)
  }

  save = () => {
    const data = new FormData();
    data.append('_method', 'PUT')
    data.append('lang', this.state.lang)
    data.append('label', this.state.text)

    fetch(process.env.REACT_APP_API_URL + '/labels/' + this.props.data.id, {
      method: 'POST',
      body: data
    })
  }

  erase = () => {
    const data = new FormData();
    data.append('_method', 'DELETE')

    fetch(process.env.REACT_APP_API_URL + '/labels/' + this.props.data.id, {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(resp => this.props.updateLabels(resp))
  }

  render() {
    return (
      <div className="label">
        <TextareaAutosize
          value={ this.state.text || '' }
          onChange={ this.onTextChange }
          onBlur={ this.save }
          placeholder="Message"
          rows="1"/>
        <select className="locale"
                value={ this.state.lang }
                onChange={ this.onLangChange }>
          <option value="fr-fr">fr</option>
          <option value="en-en">en</option>
        </select>
        <div className="erase-btn"
             onClick={ this.erase }>x</div>
      </div>
    )
  }
}

export default Label;
