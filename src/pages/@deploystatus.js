import React from 'react';
import 'stylesheet/status.scss';
import NetlifyAPI from 'netlify';

export default class Status extends React.Component {
	deployStatus = 'Loading';
	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.body.classList.add('loaded');
		}
	}
	getStatus() {
		const client = new NetlifyAPI('e0b3b9e1cdf99d6f7053e1fa9261be702661f54f4613fa1e90d255adff82137a');
		async function __getLatestStatus() {
			const DeployList = await client.listSiteDeploys({
				siteId: 'b38e55c5-7587-4df0-860f-b2be3035cdeb'
			});
			const _r = DeployList[0];
			return _r;
		}
		__getLatestStatus().then((_r) => {

            let __printmessage = '';
            switch(_r.state.toString()){
                case 'ready':
                __printmessage = 'Success';
                break;

                case 'building':
                __printmessage = 'Builiding';
                break;

                default:
                __printmessage = 'Error';
                break;
            }
            
            document.getElementById('DeployStatus').innerHTML = __printmessage;
			// console.log(_r.state.toString());
		});
	}
	statusHTML() {
		return '<iframe src="https://api.netlify.com/api/v1/badges/b38e55c5-7587-4df0-860f-b2be3035cdeb/deploy-status" frameBorder="0" width="136" height="20" border></iframe>';
	}
	render() {
		this.getStatus();
		return (
			<main id="status">
				<span>
					Deploy Status: <span id="DeployStatus">{this.deployStatus}</span>
				</span>
				{/* <div
					id="iframe"
					dangerouslySetInnerHTML={{
						__html: this.statusHTML()
					}}
				/> */}
			</main>
		);
	}
}

// e0b3b9e1cdf99d6f7053e1fa9261be702661f54f4613fa1e90d255adff82137a
