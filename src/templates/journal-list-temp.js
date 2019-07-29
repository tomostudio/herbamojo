import React from 'react';

export default class JournalList extends React.Component {
  componentDidMount() {
    if (typeof document !== `undefined`) {
      document.body.classList.add('loaded');
    }
  }
  render() {
    return <div />;
  }
}
