import React, {Component} from 'react'

class EmptyTopic extends Component {
  render() {
    return (
      <div className="empty-topic">
        <span>{ this.props.caption }</span>
      </div>
    )
  }
}

export default EmptyTopic;