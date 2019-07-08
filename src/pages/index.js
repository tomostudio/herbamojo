import React from 'react';
import Layout from 'components/layout';
import Footer from 'components/footer';
import { ScrollSnap } from 'utils/scrollsnap';
import { InViewportClass, InViewportDetect } from 'utils/inviewport';
import { Link } from 'gatsby';
import inView from 'in-view';
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

		inView('section.footer')
			.on('enter', () => {
				// console.log('enter detect');
				document.querySelector('div.overlay').classList.add('stuck');
			})
			.on('exit', () => {
				document.querySelector('div.overlay').classList.remove('stuck');
				// console.log('exit detect');
			});
	}
	componentWillUnmount() {
		if (typeof document !== `undefined`) {
			document.body.classList.remove('home');
		}
	}
	render() {
		return (
			<Layout titleText="Home" mainClass="home">
				<div className="overlay_wrapper">
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
							<div className="content">
								<span>KNOW</span>
								<span>YOUR</span>
								<span>STRENGTH</span>
                <a id="GetButton" href="#">
                  GET YOURS NOW
                </a>
							</div>
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
							<div className="inview" />
						</div>
					</section>
				</div>
				<Footer />
			</Layout>
		);
	}
}
