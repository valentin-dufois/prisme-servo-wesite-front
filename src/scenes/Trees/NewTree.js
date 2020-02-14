import React, {Component} from 'react'
import { withRouter} from 'react-router-dom'

class NewTree extends Component {
  constructor (props) {
    super(props)

    this.state = {
      desc: ''
    }
  }

  sendForm = e => {
    e.preventDefault();

    fetch(process.env.REACT_APP_API_URL + '/trees', {
      method: 'POST',
      body: new FormData(e.target),
    }).then(resp => {
      if(!resp.ok) {
        console.log('Error');
        return
      }

      return resp.json()
    }).then(resp => {
      this.props.history.push('/trees/' + resp.id);
    })
  }

  render() {
    return (
      <div className="dialog">
        <div className="dialog-wrapper">
          <h2>Nouvel arbre</h2>
          <form onSubmit={ this.sendForm }>
            <input type="text"
                   name="name"
                   placeholder="Description rapide..."/>
            <button>Créer</button>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(NewTree);