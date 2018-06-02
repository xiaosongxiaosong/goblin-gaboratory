import React from 'react';
// import { CSSTransitionGroup } from 'react-transition-group';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { Transition } from 'react-transition-group';
// import Scroll from 'react-scroll';
// import { Scrollbars } from 'react-custom-scrollbars';
import $ from 'jquery';
import styles from './Example.less';

let index = 1;
const getIndex = () => {
  const res = index;
  index += 1;
  return res;
};

const delay = (timeout) => {
  return new Promise((reslove) => {
    setTimeout(reslove, timeout);
  });
};
// const scroll = Scroll.animateScroll;
class Example extends React.PureComponent {
  constructor(props) {
    super(props);
    this.data = [];
    this.state = {
      list: [],
    };
    this.dataInterval = undefined;
  }
  componentDidMount() {
    this.dataInterval = setInterval(() => {
      for (let i = 0; i < 10; i += 1) {
        const key = getIndex();
        this.data.push({ key, text: `${i}. 测试文本 ${key} - ${i}` });
      }
      if (1000 < this.data.length) {
        this.data = this.data.splice(this.data.length - 1000, 1000);
      }
    }, 5000);

    this.show();
    this.container = $('#container');
  }
  componentWillUnmount() {
    if (this.dataInterval) {
      window.clearInterval(this.dataInterval);
    }
    this.dataInterval = undefined;
  }
  async show() {
    while (true) {
      await delay(1000);
      if (!this.dataInterval) {
        break;
      }
      if (0 === this.data.length) {
        continue;
      }
      const spliced = this.data.splice(0, 1);
      const list = this.state.list;
      if (list.length >= 5) {
        list.splice(0, list.length - 4);
      }
      // list.push(item);
      this.setState({ list: [...list, ...spliced] });
      // this.scrollbars.scrollToBottom();
      // if (this.state.list.length > 5) {
      //   this.container.animate({ scrollTop: '24px;' }, { speed: 500 });
      // }
      // debugger;
      // $();
    }
  }
  scrollToBottom() {
    if (this.state.list.length > 5) {
      this.container.animate({ scrollTop: '24px;' }, { speed: 500 });
    }
  }
  render() {
    // debugger;
    const { list } = this.state;
    // return (
    //   <div className={styles.container} id="container">
    //     {list.map(item => <div key={item.key}>{item.text}</div>)}
    //   </div>
    // );
    // return (
    //   <div className={styles.container}>
    //     <Scrollbars ref={(c) => { this.scrollbars = c; }} id="container">
    //       {list.map(item => <div key={item.key}>{item.text}</div>)}
    //     </Scrollbars>
    //   </div>
    // );
    return (
      <TransitionGroup className={styles.container} id="container">
        {list.map(item => {
          return (
            <CSSTransition
              key={item.key}
              timeout={5000}
              classNames={{
                // appear: styles.linearAppear,
                // appearActive: styles.linearAppearActive,
                enter: styles.linearEnter,
                enterActive: styles.linearEnterActive,
                // enterDone: styles.linearEnterDone,
                exit: styles.linearExit,
                exitActive: styles.linearExitActive,
                // exitDone: styles.linearExitDone,
              }}
            >
              <div>{item.text}</div>
            </CSSTransition>);
        })}
      </TransitionGroup>
    );
  }
}

// const Example = () => {
//   return (
//     <div className={styles.container}>
//       Example
//     </div>
//   );
// };

Example.propTypes = {
};

export default Example;
