import React from 'react';
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';


const store = {
  name: 'robus',
  lastName: 'gauli',
  type: 'male',
}
const makeComponent = title =>
  (props) => console.log(props) ||  
    <h1>{title}</h1>

const NotFound = (props) => console.log(props) || 
  <h1>Page not found </h1>

const Topic = ({ match: { path, isExact }}) => console.log() || (
  <div>
    <ul>
      <li><Link to={`${path}/robus`}> Robus </Link></li>
      <li><Link to={`${path}/rahul`}> Rahul </Link></li>
      <li><Link to={`${path}/ishan`}> Ishan </Link></li>
    </ul>
    <div>
      
    </div>
    <div>
      <Route path={`${path}/rahul`} component={makeComponent('Rahul')} />
      <Route path={`${path}/robus`} component={makeComponent('Robus')}/>
      <Route path={`${path}/ishan`} component={makeComponent('Ishan')} />
    </div>
    { isExact && <div> Please Choose a topics </div>}
  </div>
);

class Love extends React.Component {
  render() {
    const {
      onChange,
      children,
    } = this.props;
    
    const augmentedChildren = children
      .map(child => ({
        ...child,
        props: {...child.props, onChange }
      }))
    
      return (
      <div>
       { augmentedChildren }
      </div>
    )
  }
}

class Input extends React.Component {
  
  onChange = e => {
    const { onChange: o, name } = this.props;
    
    o(name, e.target.value)
  }
  
  render() {
    console.log(this.props);
    const {
      name,
      type,
      onChange,
      ...rest
    } = this.props;
    return (
      <input type={type} name={name} onChange={this.onChange} {...rest} />
    )
  }
}

Love.Input = Input;

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    isLogin: false,
  }

  onChange = (name, value) => () => {
    console.log(name, value);
  }

  onSubmit = e => {
    this.setState({
      isLogin: true,
    });
  }

  render() {
    const { isLogin } = this.state;
    if (isLogin) {
      return (
        <Redirect to='/dashboard' />
      )
    }
    return (
      <div>
        <Love onChange={this.onChange}>
          <Love.Input name='username' type='text'  />
          <Love.Input name='password' type='password' />
          <button onClick={this.onSubmit}> Submit </button>
        </Love>
      </div>
    )
  }
}


class Provider extends React.Component {
  constructor() {
    super();
    this.traverseChildren = this.traverseChildren.bind(this);
  }

  traverseChildren(children) {
    
    if (typeof children === 'string') {
      return children;
    } else if (typeof children === 'object' && !Array.isArray(children)) {
      let c = { ...children , 'props': { ...children.props, data: store, children: this.traverseChildren.call(this, children.props.children)}}
      return c;
    } else if (Array.isArray(children)) {
      // that means we need to cal this function again
      return children
        .map(child => this.traverseChildren.call(this, child)) 
    } 
  
  }

  render() {

    const { data } = this.props;
    const { children } = this.props;
    const c = this.traverseChildren(children);
    console.log(c);
    return (
      <div>
        {c}
      </div>
    );
  }
}

class Dashboard extends React.Component {
  render() {
    console.log('dasboard', this.props.data)
    const { authenticated } = this.props;
    if (!authenticated) {
      return (
        <Redirect to='/login' />
      );
    }
    return (
      
      <div> This is a dashboard </div>
      
    )
  }
}



class App extends React.Component {
  state= {
    authenticated: false,
  }

  onClick = e => {
    this.setState({
      authenticated: true
    })
  }

  render() {
    return (
      <Provider data={store} >
        <Router>
          <div>
            <div>
            My App
            </div>
            <ul>
              <li><Link to='/'> home </Link></li>
              <li><Link to='/about'> About </Link></li>
              <li><Link to='/topics'> Topics </Link></li>
              <li><Link to='/login'> Login </Link></li>
            </ul>
          <hr/>
          <button onClick={this.onClick}> Aunthenticate </button>
          <div>
            <Switch>
              <Route exact path='/' component={makeComponent('Home')} />
              <Route path='/about' component={makeComponent('About')} />
              <Route path='/topics' component={Topic} />
              <Route path='/login' component={Login} />
              <Route path='/dashboard' render={(props) => {
                return <Dashboard authenticated={this.state.authenticated} {...props} />
              }} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    </Provider>
    );
  }
}

export default App;