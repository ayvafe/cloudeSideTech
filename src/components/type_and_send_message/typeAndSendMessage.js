import './typeAndSendMessage.css';
import PropTypes from 'prop-types'
import React from 'react';

class TypeAndSendMessage extends React.Component {
	static propTypes = {
		onSubmitMessage: PropTypes.func.isRequired,
	}
	state = {
		message: '',
	}

	render() {
		return (
			<form className="type-and-send-message"
			action="."
			onSubmit={e => {
				e.preventDefault()
				this.props.onSubmitMessage(this.state.message)
				this.setState({ message: '' })
			}}
			>
			<input
			type="text"
			placeholder={'Enter message...'}
			className="type-message"
			value={this.state.message}
			onChange={e => this.setState({ message: e.target.value })}
			/>
			<input type="submit" className="send-message" value={''} />
			</form>
		)
	}
}

export default TypeAndSendMessage
