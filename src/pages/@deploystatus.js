import React from 'react';
import 'stylesheet/status.scss';

export default class Status extends React.Component {
	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.body.classList.add('loaded');
		}
		const NetlifyAPI = require('netlify');
		const client = new NetlifyAPI('e0b3b9e1cdf99d6f7053e1fa9261be702661f54f4613fa1e90d255adff82137a');

		async function getDeployStatus() {
			try {
                const DeployList = await client.listSiteDeploys({
					siteId: 'b38e55c5-7587-4df0-860f-b2be3035cdeb'
                });
                const _r = DeployList[0];
                console.log(_r);
				return _r;
			} catch (e) {}
		}
		console.log(getDeployStatus());
	}
	statusHTML() {
		return '<iframe src="https://api.netlify.com/api/v1/badges/b38e55c5-7587-4df0-860f-b2be3035cdeb/deploy-status" frameBorder="0" width="136" height="20" border></iframe>';
	}
	render() {
		return (
			<main id="status">
				Deploy Status
				<div
					id="iframe"
					dangerouslySetInnerHTML={{
						__html: this.statusHTML()
					}}
				/>
			</main>
		);
	}
}

// e0b3b9e1cdf99d6f7053e1fa9261be702661f54f4613fa1e90d255adff82137a
