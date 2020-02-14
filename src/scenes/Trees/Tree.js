import React, {Component} from 'react'
import EmptyTopic from '../../components/EmptyTopic'
import Behaviour from './Tree/Behaviour'

class Tree extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      behaviours: [],
      variables: []
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(Number(prevProps.match.params.id) !== Number(this.props.match.params.id)) {
      this.setState({
        loaded: false,
      }, this.loadData)
    }
  }

  loadData = () => {
    fetch(process.env.REACT_APP_API_URL + '/trees/' + this.props.match.params.id)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          loaded: true,
          behaviours: resp.behaviours
        })
      })

    fetch(process.env.REACT_APP_API_URL + '/variables')
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          loaded: true,
          variables: resp
        })
      })
  }

  getBehaviour = behaviourID => {
    // Make sure the behaviour id is a Number
    const bID = Number(behaviourID)

    if(bID === 0)
      return 0;

    const res = this.state.behaviours.find(b => b.id === bID)
    return res !== undefined ? res : 0;
  }

  shownBehaviors = []

  makeTree = (behaviours, rowIndex = 0) => {
    if(behaviours.every(b => b === 0)) {
      return []
    }

    const nextRow = [];

    // Build the row
    const row = (
      <div className="behaviour-row" key={ rowIndex }>
        { behaviours.map((b, i) => {
          // Is this a behavior, a placeholder, or a behavior already shown ?
          if(b === 0 || this.shownBehaviors.includes(b.id)) {
            nextRow.push(0);
            return <span className="behaviour behaviour-placeholder" key={'placeholder-' + i}></span>
          }

          if(b.outs.length === 0) {
            nextRow.push(0)
          }

          this.shownBehaviors.push(b.id);
          nextRow.push(b.outs.map(out => out.next_behaviour));
          return <Behaviour data={ b }
                            key={ b.id + '-' + b.outs.length + '-' + b.outs.map(o => o.next_behaviour).join('-') }
                            updateTree={ this.updateTree }
                            variables={ this.state.variables }/>
        }) }
      </div>
    )

    // Select behaviours for the next row
    return [row, ...this.makeTree(nextRow.flat().map(bID => this.getBehaviour(bID)), rowIndex+1)]
  }

  updateTree = data => {
    this.setState({
      behaviours: data
    })
  }

  render() {
    if(!this.state.loaded)
      return <EmptyTopic caption="Arbres" />

    if(this.state.behaviours.length === 0)
      return "Should not happen"

    // Reset shown behavior array
    this.shownBehaviors = []

    return (
      <main className="tree">
        { this.makeTree([this.state.behaviours[0]]) }
      </main>
    )
  }
}

export default Tree;