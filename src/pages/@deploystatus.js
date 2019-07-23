import React from 'react';
import 'stylesheet/status.scss';
import NetlifyAPI from 'netlify';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

export default class Status extends React.Component {
  deployStatus = 'Loading';
  deployStatusPassword = null;
  componentDidMount() {
    if (typeof document !== `undefined`) {
      document.body.classList.add('loaded');
    }
  }
  getStatus() {
    console.log('checking status');
    const client = new NetlifyAPI(
      'f302a97fa24fc20726bb9db6d53a097c011f8507a9a18f5f5fa50d0816926aca'
    );
    async function __getLatestStatus() {
      const DeployList = await client.listSiteDeploys({
        siteId: 'b38e55c5-7587-4df0-860f-b2be3035cdeb'
      });
      const _r = DeployList[0];
      return _r;
    }

    __getLatestStatus().then(_r => {
      let __printmessage = '';
      switch (_r.state.toString()) {
        case 'ready':
          __printmessage = 'Success';
          document.getElementById('DeployStatus').classList.add('success');
          document.getElementById('DeployStatus').classList.remove('build');
          document.getElementById('DeployStatus').classList.remove('error');
          break;

        case 'building':
          document.getElementById('DeployStatus').classList.remove('success');
          document.getElementById('DeployStatus').classList.remove('error');
          document.getElementById('DeployStatus').classList.add('build');
          __printmessage = 'Building';
          break;

        default:
          __printmessage = 'Error';
          document.getElementById('DeployStatus').classList.add('error');
          document.getElementById('DeployStatus').classList.remove('build');
          document.getElementById('DeployStatus').classList.remove('success');
          break;
      }
      document.getElementById('DeployStatus').innerHTML = __printmessage;
    });
  }
  statusHTML() {
    return '<iframe src="https://api.netlify.com/api/v1/badges/b38e55c5-7587-4df0-860f-b2be3035cdeb/deploy-status" frameBorder="0" width="136" height="20" border></iframe>';
  }
  fetchInterval = null;
  resetSubmitTimeout = null;
  checkPass = e => {
    if (this.deployStatusPassword !== null) {
      e.preventDefault();
      const getSubmitBtn = document.querySelector(
        '#CheckForm > input[type=submit]'
      );
      const getPass = document.querySelector('#CheckForm > input.password')
        .value;
      const getMainContainer = document.querySelector('main#status');
      if (getPass === this.deployStatusPassword) {
        // console.log('password correct');
        this.triggerStatus();
        getSubmitBtn.value = 'Accepted';
				getSubmitBtn.classList.remove('error');
				getSubmitBtn.classList.add('success');

        if (this.resetSubmitTimeout !== null)
          clearTimeout(this.resetSubmitTimeout);

        this.resetSubmitTimeout = setTimeout(() => {
          getMainContainer.classList.add('displayStatus');

          if (this.resetSubmitTimeout !== null)
            clearTimeout(this.resetSubmitTimeout);

          this.resetSubmitTimeout = setTimeout(() => {
						getSubmitBtn.classList.remove('success');
						getSubmitBtn.classList.remove('error');
            getSubmitBtn.value = 'Check Status';
          }, 2500);
        }, 500);
      } else {
        getSubmitBtn.value = 'Incorrect';
				getSubmitBtn.classList.remove('success');
				getSubmitBtn.classList.add('error');
        if (this.resetSubmitTimeout !== null)
          clearTimeout(this.resetSubmitTimeout);
        this.resetSubmitTimeout = setTimeout(() => {
					getSubmitBtn.classList.remove('success');
					getSubmitBtn.classList.remove('error');
          getSubmitBtn.value = 'Check Status';
          if (this.resetSubmitTimeout !== null)
            clearTimeout(this.resetSubmitTimeout);
        }, 2500);
      }
    }
  };
  triggerStatus() {
    this.getStatus();
    if (this.fetchInterval !== null) clearInterval(this.fetchInterval);
    this.fetchInterval = setInterval(() => {
      this.getStatus();
    }, 15000);
  }
  render() {
    if (
      typeof this.props.data.general.frontmatter.deploy_status_password ===
      'string'
    ) {
      this.deployStatusPassword = this.props.data.general.frontmatter.deploy_status_password;
    }
    return (
      <main id='status'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>
            DeployStatus for {this.props.data.general.frontmatter.web_name}
          </title>
        </Helmet>
        <form id='CheckForm'>
          <input
            className='password'
            type='password'
            name='pass'
            placeholder='Enter Password'
          />
          <input type='submit' value='Check Status' onClick={this.checkPass} />
        </form>
        <div id='StatusDisplay'>
          <span>Deploy Status</span>
          <span id='DeployStatus'>{this.deployStatus}</span>
					<span>Status is checked every 15 seconds</span>
        </div>
      </main>
    );
  }
}

export const query = graphql`
  query {
    general: markdownRemark(
      frontmatter: {
        issetting: { eq: true }
        contenttype: { eq: "general_setting" }
      }
    ) {
      frontmatter {
        web_name
        deploy_status_password
      }
    }
  }
`;
