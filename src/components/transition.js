import React from 'react';
import {
  TransitionGroup,
  Transition as ReactTransition
} from 'react-transition-group';

//This variable will be responsible for our animation duration
const timeout = 500;

//This object contains basic styles for animation, but you can extend them to whatever you like. Be creative!
const getTransitionStyles = {
  entering: {
    opacity: 0,
    position: 'absolute',
  },
  entered: {
    transition: `opacity ${timeout}ms ease-in-out`,
    opacity: 1
  },
  exiting: {
    transition: `opacity ${timeout}ms ease-in-out`,
    opacity: 0,
    position: 'absolute',
  }
};

class Transition extends React.PureComponent {
  render() {
    //Destructuring props to avoid garbage this.props... in return statement
    const { children, location } = this.props;
    return (
      //Using TransitionGroup and ReactTransition which are both
      //coming from  'react-transition-group' and are required for transitions to work
      <TransitionGroup>
        <ReactTransition
          //the key is necessary here because our ReactTransition needs to know when pages are entering/exiting the DOM
          key={location.pathname}
          //duration of transition
          timeout={{
            enter: timeout,
            exit: timeout
          }}
          // addEndListener={(node, done) => {
          //   // console.log('transition end');
          //   // // use the css transitionend event to mark the finish of a transition
          //   // node.addEventListener('transitionend', done, false);
          // }}
        >
          {//Application of the styles depending on the status of page(entering, exiting, entered) in the DOM
          status => (
            <div
              style={{
                ...getTransitionStyles[status]
              }}
            >
              {children}
            </div>
          )}
        </ReactTransition>
      </TransitionGroup>
    );
  }
}

export default Transition;
