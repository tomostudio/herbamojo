import React from 'react';
import 'stylesheet/status.scss';
import NetlifyAPI from 'netlify';
import { Helmet } from 'react-helmet';

export default class Status extends React.Component {
	deployStatus = 'Loading';
	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.body.classList.add('loaded');
		}
	}
	getStatus() {
		const client = new NetlifyAPI('f302a97fa24fc20726bb9db6d53a097c011f8507a9a18f5f5fa50d0816926aca');
		async function __getLatestStatus() {
			const DeployList = await client.listSiteDeploys({
				siteId: 'b38e55c5-7587-4df0-860f-b2be3035cdeb'
			});
			const _r = DeployList[0];
			return _r;
		}

		__getLatestStatus().then((_r) => {
			let __printmessage = '';
			switch (_r.state.toString()) {
				case 'ready':
					__printmessage = 'Success';
					break;

				case 'building':
					__printmessage = 'Building';
					break;

				default:
					__printmessage = 'Error';
					break;
			}
			document.getElementById('DeployStatus').innerHTML = __printmessage;
		});
	}
	statusHTML() {
		return '<iframe src="https://api.netlify.com/api/v1/badges/b38e55c5-7587-4df0-860f-b2be3035cdeb/deploy-status" frameBorder="0" width="136" height="20" border></iframe>';
	}
	fetchInterval = null;
	checkPass(e){
		e.preventDefault();
		const getPass = document.querySelector('#CheckForm > input.password')
		// if(getPass)
	}
	triggerStatus(){
		this.getStatus();
		if (this.fetchInterval !== null) clearInterval(this.fetchInterval);
		this.fetchInterval = setInterval(() => {
			this.getStatus();
		}, 15000);
	}
	render() {
		this.triggerStatus();
		return (
			<main id="status">
				<div id="CheckForm">
					<input className="password" type="password" name="pass" placeholder="Enter Password"/>
					<input type="submit" value="Check Status" onClick={this.checkPass}/>
				</div>
				<span id="StatusDisplay">
					Deploy Status: <span id="DeployStatus">{this.deployStatus}</span>
				</span>
			</main>
		);
	}
}
