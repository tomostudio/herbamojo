import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import { ScrollSnap } from 'utils/scrollsnap';
import { InViewClass, InViewDetect } from 'utils/inview';
import { Link } from 'gatsby';
import HerbamojoLogo from 'images/symbols/herbamojologo.svg';

export default class Home extends React.Component {
	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.body.classList.add('home');
		}
		ScrollSnap.init({
			sections_identifier: 'main.home section',
			snap_identifier: 'div.overlay .snap_nav',
			duration: 250,
			responsive_width: 300
    });
		// ScrollSnap.kill();
    const inview1 = new InViewClass({target: 'div.inview', visibility: 0});
	}
	componentWillUnmount() {
		if (typeof document !== `undefined`) {
			document.body.classList.remove('home');
		}
	}
	render() {
		return (
			<Layout titleText="Home" mainClass="home">
				<div className="overlay">
					<div className="wrapper">
						<div>
							<Link className="disable" to="/">
								EN
							</Link>
							<Link to="/">ID</Link>
						</div>
						<div className="snap_nav">
							<span />
							<span className="active" />
							<span />
						</div>
					</div>
				</div>
				<section>
					<div className="wrapper">
						<h1 className="hidden">Title</h1>
						<span className="logo">
							<img src={HerbamojoLogo} alt="herbamojo" />
						</span>
						{/* <Link className="logo" to="/">
							<img src={HerbamojoLogo} alt="herbamojo"/>
						</Link> */}
					</div>
				</section>
				<section>
					<div className="wrapper">
						<h1>ABOUT</h1>
					</div>
				</section>
				<section>
					<div className="wrapper">
						<h1>BENEFITS</h1>
            <div className="inview"></div>
					</div>
				</section>
				<Footer />
			</Layout>
		);
	}
}
