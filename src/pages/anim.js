import React from 'react';
import Layout from 'components/layout';
import lottie from 'lottie-web';
// import animationData from 'animationdata/data-step1.json';
import animationData from 'animationdata/bodymovintest.json';

export default class Anim extends React.Component {
	componentDidMount() {
		AnimObject.anim = lottie.loadAnimation({
			container: document.getElementById('lottie'),
			name: 'test',
			renderer: 'svg',
			loop: true,
			autoplay: true,
			animationData
		});

		const _complete = () => {
			console.log('complete');
		}
		const _loopcomplete = () => {
			console.log('loop complete');
		}

		AnimObject.anim.addEventListener('complete', _complete);
		AnimObject.anim.addEventListener('loopComplete', _loopcomplete);
	}

	_pause() {
		AnimObject.anim.goToAndPlay(50);
	}

	_stop() {
		lottie.stop( 'test');
	}
	render() {
		return (
			<Layout headerText="Animation Test">
				<h1>Lottie Animation Testing</h1>
				<button onClick={this._pause}>PAUSE</button>
				<button onClick={this._stop}>STOP</button>
				<div id="lottie" />
			</Layout>
		);
	}
}

const AnimObject = {
	anim: null
};
