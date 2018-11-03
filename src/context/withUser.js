import React, { Component, createContext } from 'react';
import firebase from 'firebase/app';

const Context = createContext();  // context를 생성

// Context에는 Provider 와 Consumer 라는 개념이 존재.
const { Provider, Consumer: UserConsumer } = Context;

class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {}
    };
    // Get a reference to the storage service, which is used to create references in your storage bucket
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({currentUser: user})
      } else {
        // No user is signed in.
        this.setState({currentUser: {}})
      }
    });
  }
  // 여기서 actions 라는 객체는 우리가 임의로 설정하는 객체입니다.
  // 나중에 변화를 일으키는 함수들을 전달해줄때, 함수 하나하나 일일히 전달하는 것이 아니라,
  // 객체 하나로 한꺼번에 전달하기 위함입니다.
  actions = {
    setValue: () => {
      this.setState({value: '바꼈지롱'});
    }
  };

  render() {
    const { state, actions } = this;
    // Provider 내에서 사용할 값은, "value" 라고 부릅니다.
    // 현재 컴포넌트의 state 와 actions 객체를 넣은 객체를 만들어서,
    // Provider 의 value 값으로 사용하겠습니다.
    const store = { state, actions };
    return (
      <Provider value={store}>
        {this.props.children}
      </Provider>
    )
  }
}

const withUser = (WrappedComponent) => {
  return (props) => {
    return (
      <UserConsumer>
        {({state, actions}) => <WrappedComponent userState={state} userActions={actions} {...props} />}
      </UserConsumer>
    )
  }
};

// Provider 에서 state 를 사용하기 위해서 컴포넌트를 새로 만들어줍니다.
export { UserProvider, UserConsumer, withUser };
