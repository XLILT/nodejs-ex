import React from 'react';
import { KunPengLoginForm } from './login';
import { KunPengRegisterForm } from './register';
import { KunPengFooter } from './footer';
import './login-register-switcher.css';

class KunPengLoginReisterSwithcer extends React.Component {
	state = {
		showLogin: true,
		showRegister: false
	}

	switchBox = (e) => {
		if(e === 'register') {
			this.setState({
				showLogin: false,
				showRegister: true
			})
		}else if(e === 'login') {
			this.setState({
				showLogin: true,
				showRegister: false
			})
		}
	};

	render() {
		return (
			<div>
				{ this.state.showLogin && <KunPengLoginForm switchBox={this.switchBox} /> }
				{ this.state.showRegister && <KunPengRegisterForm switchBox={this.switchBox} /> }
				<KunPengFooter />
			</div>
		);
	}	
}

export { KunPengLoginReisterSwithcer };
