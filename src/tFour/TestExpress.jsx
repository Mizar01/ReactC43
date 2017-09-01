import React from 'react';

class TestExpress extends React.Component {


	state = {text: ""}

	componentDidMount() {
		this.loadData()
		//setInterval(() => {this.loadData()}, "10000")

	}

	loadData() {
		fetch("/test")
			.then(res => res.json())
			.then(d => this.setState({text: d.text}))
	}

	render() {
		return <div style= {{ fontWeight: "bold", color: "aqua" }}>
				Server Message: { this.state.text }
			</div>;
	}


}

export default TestExpress;
