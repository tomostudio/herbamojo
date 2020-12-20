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

    async function __getLatestStatus() {
      const client = new NetlifyAPI(
        'OYkkGnPqf9de7DnGPUq1C4LTEgWyIs44AFpGxCjSknE'
      );

      const listSite = await client.listSites();
      console.log(listSite);
      const DeployList = await client.listSiteDeploys({
        siteId: '1c86a3bb-30cc-4b70-a38a-055ef3338287',
      });

      let count = 0;
      //CHECK IF DEPLOY IS SKIPPED or NEW
      while (count < DeployList.length) {
        if (
          DeployList[count].error_message === 'Skipped' ||
          DeployList[count].state === 'new'
        ) {
          count++;
        } else {
          break;
        }
      }

      const _r = DeployList[count];
      return _r;
    }

    __getLatestStatus().then((_r) => {
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

  fetchInterval = null;
  resetSubmitTimeout = null;
  checkPass = (e) => {
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
    // if (
    //   typeof this.props.data.general.frontmatter.deploy_status_password ===
    //   'string'
    // ) {
    //   this.deployStatusPassword = this.props.data.general.frontmatter.deploy_status_password;
    // }
    return (
      // <main id='status'>
      //   <Helmet>
      //     <meta charSet='utf-8' />
      //     <title>
      //       Deploy Status for {this.props.data.general.frontmatter.web_name}
      //     </title>
      //   </Helmet>
      //   <form id='CheckForm'>
      //     <input
      //       className='password'
      //       type='password'
      //       name='pass'
      //       placeholder='Enter Password'
      //     />
      //     <input type='submit' value='Check Status' onClick={this.checkPass} />
      //   </form>
      //   <div id='StatusDisplay'>
      //     <span>Deploy Status</span>
      //     <span id='DeployStatus'>{this.deployStatus}</span>
      //     <span>Status is checked every 15 seconds</span>
      //   </div>
      // </main>
      <div></div>
    );
  }
}

export const query = graphql`
  query {
    general: mdx(
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
