import React from 'react';
import Layout from 'components/layout';
import lottie from 'lottie-web';
import animationData from 'animationdata/bodymovintest.json';

export default class Anim extends React.Component {
	componentDidMount() {
    lottie.loadAnimation({
      container: document.getElementById('lottie'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData
    });
	}

	render() {
		return (
			<Layout headerText="Animation Test">
				<h1>Animation Testing</h1>
				<div id="lottie" />
			</Layout>
		);
	}
}
