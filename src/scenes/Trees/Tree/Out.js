import React, {Component} from 'react'
import Label from './Label'
import Variables from './Variables'
import TextareaAutosize from 'react-textarea-autosize'

class Out extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: this.props.data.id,
      condition: this.props.data.condition,
      code: this.props.data.condition_code,
      delay: this.props.data.delay,
      delayDuration: this.props.data.delay_duration,
      delayVariance: this.props.data.delay_variance,
      labels: this.props.data.labels,
      nextBehaviour: this.props.data.next_behaviour,
      canRemoveNext: this.props.data.canRemoveNext,
    }

    this.formRef = React.createRef();
  }

  onConditionChange = e => {
    this.setState({
      condition: e.target.value
    })
  }

  onConditionCodeChange = e => {
    this.setState({
      code: e.target.value
    })
  }

  onDelayChange = e => {
    this.setState({
      delay: e.target.checked,
    }, this.save)
  }

  onDelayDurationChange = e => {
    this.setState({
      delayDuration: e.target.value,
    }, this.save)
  }

  onDelayVarianceChange = e => {
    this.setState({
      delayVariance: e.target.value,
    }, this.save)
  }

  save = () => {
    fetch(process.env.REACT_APP_API_URL + '/outs/' + this.state.id, {
      method: 'POST',
      body: new FormData(this.formRef.current),
    })
  }

  insertLabel = () => {
    const data = new FormData();
    data.append('label', '');
    data.append('out', this.state.id);

    fetch(process.env.REACT_APP_API_URL + '/labels', {
      method: 'POST',
      body: data
    }).then(resp => resp.json())
      .then(resp => this.setState({
        labels: [...this.state.labels, resp]
      }))
  }

  insertBehaviour = () => {
    this.props.insertBehaviour(this.state.id);
  }

  setBehaviour = e => {
    if (e.key !== 'Enter' || !isFinite(e.target.value))
      return;

    this.props.setBehaviour(this.state.id, Number(e.target.value))
  }

  removeNextBehaviour = e => {
    this.props.removeNextBehaviour(this.state.id)
  }

  removeOut = () => {
    const data = new FormData();
    data.append('_method', 'DELETE')

    fetch(process.env.REACT_APP_API_URL + '/outs/' + this.props.data.id, {
      method: 'POST',
      body: data,
    }).then(resp => resp.json())
      .then(resp => this.props.updateTree(resp))
  }


  updateLabels = data => {
    this.setState({
      labels: data,
    })
  }

  render() {
    return (
      <div className="out-wrapper" onSubmit={ e => e.preventDefault() }>
        { this.state.nextBehaviour === null &&
        <div className="remove-btn remove-out" onClick={ this.removeOut }>x</div> }
        <form ref={ this.formRef }>
          <input type="hidden" name="_method" value="PUT"/>
          <details className="out-params">
            <summary className="out-title">Sortie #{ this.state.id }</summary>
            <TextareaAutosize
              name="condition"
              className="out-condition"
              placeholder="Pas de condition"
              value={ this.state.condition || '' }
              onChange={ this.onConditionChange }
              onBlur={ this.save }></TextareaAutosize>
            <div className="delay-row">
              <input type="checkbox"
                     name="delay"
                     id={ 'delay-checkbox-' + this.state.id }
                     checked={ this.state.delay }
                     onChange={ this.onDelayChange }/>
              <label htmlFor={ 'delay-checkbox-' + this.state.id }
                     className="delay-label">{ this.state.delay ? 'Delai' : 'Délai par défaut' }</label>
              { this.state.delay ? [
                <label htmlFor="delay-duration" key="delay-duration-label">Durée(s):</label>,
                <input type="number"
                       id="delay-duration"
                       name="delayDuration"
                       value={ this.state.delayDuration || 0 }
                       onChange={ this.onDelayDurationChange }
                       placeholder="Durée"
                       min={ 0 }
                       step={ .1 }
                       disabled={ !this.state.delay }
                       key="delay-duration-field"/>,
                <label htmlFor="delay-variance" key="delay-variance-label">Vari.(s):</label>,
                <input type="number"
                       id="delay-variance"
                       name="delayVariance"
                       value={ this.state.delayVariance || 0 }
                       onChange={ this.onDelayVarianceChange }
                       placeholder="Variance"
                       min={ 0 }
                       step={ .1 }
                       disabled={ !this.state.delay }
                       key="delay-variance-value" />,
              ] : null }
            </div>
            <details className="outputs">
              <summary>Variables de sortie</summary>
              <Variables name="outputs"
                         values={ this.props.data.variables }
                         variables={ this.props.variables }
                         save={ this.save }/>
            </details>
            <details className="out-code-wrapper">
              <summary>Code</summary>
              <TextareaAutosize name="condition_code"
                                className="out-code"
                                placeholder="Non validé..."
                                value={ this.state.code || '' }
                                onChange={ this.onConditionCodeChange }
                                onBlur={ this.save }/>
            </details>
          </details>
          <div className="labels">
            <h5>Labels</h5>
            { this.state.labels.map(label => (
              <Label data={ label }
                     key={ label.id }
                     placeholder="Phrase..."
                     updateLabels={ this.updateLabels }/>
            )) }
            <div className="add-label" onClick={ this.insertLabel }>+</div>
          </div>
        </form>
        <div className="next-behaviour">
          <span className="next-behaviour-label">Suite: </span>
          { this.state.nextBehaviour === null ? [
            <div className="btn" key="new-behaviour"
                 onClick={ this.insertBehaviour }>Nouveau</div>,
            <input type="number"
                   className="existing-behaviour"
                   key="existing-behaviour"
                   placeholder="Existant..."
                   onKeyPress={ this.setBehaviour }/>
          ] : [
            <div className="behaviour-id" key="next-behaviour-id">#{ this.state.nextBehaviour }</div>,
            this.state.canRemoveNext &&
            <div className="btn erase-behaviour" key="erase-behaviour" onClick={ this.removeNextBehaviour }>x</div>,
          ] }
        </div>
      </div>
    )
  }
}

export default Out;
