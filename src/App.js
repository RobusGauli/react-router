
const SHOW_MENU = 'SHOW_MENU';
const HIDE_MENU = 'HIDE_MENU';
const TOGGLE_MENU = 'TOGGLE_MENU';

const hasOwnProp = (object, key) =>
	Object.prototype.hasOwnProperty.call(object, key);
const uniqueId = () =>
	Math.random().toString(30).substring(7);


class GlobalEventListener {
	constructor() {
		this.callbacks = {}
		if (
			typeof window !== 'undefined' &&
			window.document &&
			window.document.createElement
		) {
			// we have a valid dom
			window.addEventListener(SHOW_MENU, this.handleShowMenu);
			window.addEventListener(HIDE_MENU, this.handleHideMenu);
			window.addEventListener(TOGGLE_MENU, this.handleToggleMenu);
		}
	}
	
	handleToggleMenu = e => {
		for(const id in this.callbacks) {
			if (hasOwnProp(this.callbacks, id)) {
				const obj = this.callbacks[id];
				obj.toggle(e);
			}
		}
		
	}
	handleShowMenu = e => {

		console.log(this.callbacks);
		for(const id in this.callbacks) {
			console.log(id);
			if (hasOwnProp(this.callbacks, id)) {
				console.log(this.callbacks[id])
				const obj = this.callbacks[id];
				obj.show(e);
			}
		}
	}
	
	handleHideMenu = (e) => {
		for(const id in this.callbacks) {
			if (hasOwnProp(this.callbacks, id)) {
				const obj = this.callbacks[id];
				obj.hide(e)
			}
		}
	}
	register(showCallback, hideCallback, toggleCallback) {
		const id = uniqueId();
		this.callbacks[id] = {
			show: showCallback,
			hide: hideCallback,
			toggle: toggleCallback
		};
		
		console.log(this.callbacks);
		return id; 
		
	}
	
	unregister(id) {
		// check to see if the id exists
		if(id && this.callbacks[id]) {
			delete this.callbacks[id];
		}
	}
}

const globalListener = new GlobalEventListener();

function dispatchGlobalEvent(eventName, opts, target=window) {
	let event;
	
	if (typeof window.CustomEvent === 'function') {
		
		event = new window.CustomEvent(
			eventName,
			{
				detail: opts
			}
		)
		
		if (target) {
			target.dispatchEvent(event);
		}
	}
}

function showMenu(config, target) {
	dispatchGlobalEvent(
		SHOW_MENU,
		Object.assign({}, config),
		target
	);
	
}

function toggleMenu(config, target) {
	dispatchGlobalEvent(
		TOGGLE_MENU,
		Object.assign({}, config),
		target
	)
}

function hideMenu(config, target) {
	dispatchGlobalEvent(
		HIDE_MENU,
		Object.assign({}, config),
		target,
	)
}

class App extends React.Component {
	render() {
		return (
 <div className="customize-column">
			<ContextMenuTrigger id='tab1'>
 <div className="customize-selectable d-flex align-items-center">
                <span>Customize Columns</span>
                <i className="hb-arrow-down fs9 ml-2" />
              </div>
				</ContextMenuTrigger>
				<ContextMenu id='tab1'>
					<div className="customize-options">
                <div className="options">
                  <div className="checkbox-wrap d-inline-flex align-items-start">
                    <div className="fake-checkbox mr-2">
                      <input type="checkbox" />
                    </div>
                    <span className="h-main-text-color fs13">
                      Footing Width or Diameter (ft)
                    </span>
                  </div>
                </div>
                <div className="options">
                  <div className="checkbox-wrap d-inline-flex align-items-start">
                    <div className="fake-checkbox mr-2">
                      <input type="checkbox" />
                    </div>
                    <span className="h-main-text-color fs13">
                      Footing Length
                    </span>
                  </div>
                </div>
                <div className="options">
                  <div className="checkbox-wrap d-inline-flex align-items-start">
                    <div className="fake-checkbox mr-2">
                      <input type="checkbox" />
                    </div>
                    <span className="h-main-text-color fs13">
                      Bearing Pressure
                    </span>
                  </div>
                </div>
                <div className="options">
                  <div className="checkbox-wrap d-inline-flex align-items-start">
                    <div className="fake-checkbox mr-2">
                      <input type="checkbox" />
                    </div>
                    <span className="h-main-text-color fs13">
                      No. of piers per Footing
                    </span>
                  </div>
                </div>
                <div className="options">
                  <div className="checkbox-wrap d-inline-flex align-items-start">
                    <div className="fake-checkbox mr-2">
                      <input type="checkbox" />
                    </div>
                    <span className="h-main-text-color fs13">
                      Actual Area Replace ratio
                    </span>
                  </div>
                </div>
              </div>
				</ContextMenu>
				
				

			</div>
		);
	}
}

class ContextMenu extends React.Component {
	
	state = {
		show: false,
	}
	componentDidMount() {
		this.id = globalListener.register(this.handleShow, this.handleHide, this.handleToggle);
	}

	componentDidUnmount() {
		globalListener.unregister(this.id);
	}

	handleShow = e => {
		
		this.setState(state => {
			if (state.show) {
				return null;
			}
			return {
				show: true
			}
		})
	}

	handleHide = e => {

		this.setState(state => {
			if (state.show) {
				return {
					show: false
				}
			}
			return null;
		}, () => {
			
			const { show } = this.state;
			if (!show) {
				this.unRegisterListeners();
			}
		})

	}
	
	handleClick() {
		this.setState(state => {
			return {
				show: !state.show
			}
		})
	}

	handleToggle = e => {
		
		if (e.detail.id !== this.props.id) return;
		this.setState(state => {
			return {
				show : !state.show
			}
		}, () => {
			const { show } = this.state;
			console.log('show', show);
			if (show) {
				this.registerListeners();
			} else {
				this.unRegisterListeners()
			}
		})
	}
	
	handleDocumentMouseClick = e => {
		 console.log('this si it', e);
		console.log(this.node.contains(e.target));
		if (this.node.contains(e.target)) return;
		hideMenu();
	}
	
	registerListeners = () => {
		document.addEventListener('click', this.handleDocumentMouseClick);
	}
	
	unRegisterListeners = () => {
		document.removeEventListener('click', this.handleDocumentMouseClick);
	}
	saveElement = node => {
		this.node = node;
	}
	render() {
		const {
			children	
		} = this.props;
		
		const props = {
			children,
			ref: this.saveElement
		}
		const { state } = this;
		if (!state.show) {
			return null;
		}
		return React.createElement('div', props);
	}
}

class ContextMenuTrigger extends React.Component {
	onClick = e => {
		// create a new event to toggle
		const config = {
			id: this.props.id,
			target: this.elem
		}
		toggleMenu(config);
	}
	elemRef = node => {
		this.elem = node;
	}
	render() {
		const {
			renderTag,
			children,
			...rest
		} = this.props;
		
		const props = {
			children,
			onClick: this.onClick,
			ref: this.elemRef
		}
		return React.createElement(renderTag, props);
	}
}

ContextMenuTrigger.defaultProps = {
	renderTag: 'div'
}


ReactDOM.render(<App />, document.getElementById('app'));
