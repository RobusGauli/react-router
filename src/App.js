import React from 'react';
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

const makeComponent = title =>
  () => 
    <h1>{title}</h1>

const NotFound = () =>
  <h1>Page not found </h1>

const Topic = ({ match: { path, isExact }}) => (
  <div>
    <ul>
      <li><Link to={`${path}/robus`}> Robus </Link></li>
      <li><Link to={`${path}/rahul`}> Rahul </Link></li>
      <li><Link to={`${path}/ishan`}> Ishan </Link></li>
    </ul>
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

class Dashboard extends React.Component {
  render() {
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
    );
  }
}

export default App;