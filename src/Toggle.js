import React, { Component } from 'react';

class Toggle extends Component {
  state = {isToggleOn: true}

  handleClick =() => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
    this.props.showPlaceList();
  }

  render() {
    return (
       <div className="menu_logo">
          <a id="menu" onClick={this.handleClick}>
          {this.state.isToggleOn
              ?
              <svg viewBox="0 0 44 44">
              <rect x="4" y="12" fill="currentColor" width="32px" height="2"></rect>
              <rect x="4" y="20" fill="currentColor" width="32px" height="2"></rect>
              <rect x="4" y="28" fill="currentColor" width="32px" height="2"></rect>
              </svg>
              :
              <svg viewBox="0 0 44 44">
              <path d="M4 12 L36 28" stroke="currentColor" strokeWidth="3" />
              <path d="M4 28 L36 12" stroke="currentColor" strokeWidth="3" />
              </svg>
          }
          </a>
      </div>
    );
  }
}

export default Toggle;