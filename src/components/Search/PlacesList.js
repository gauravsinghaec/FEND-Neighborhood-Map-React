import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Define values for keycodes
const VK_ENTER = 13;
const VK_SPACE = 32;
const VK_LEFT = 37;
const VK_UP = 38;
const VK_RIGHT = 39;
const VK_DOWN = 40;

class PlacesList extends Component {
  // Helper function to convert NodeLists to Arrays
  static slice = nodes => Array.prototype.slice.call(nodes);

  // Add PropTypes validation
  static propTypes = {
    locations: PropTypes.instanceOf(Array).isRequired,
    selectPlace: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.refList = React.createRef();
    this.refListItem = React.createRef();
  }

  state = {
    buttons: [],
    focusedIdx: 0,
    focusedButton: {},
  }

  componentDidUpdate(prevProps) {
    const { locations } = this.props;
    if (locations.length > 0 && prevProps.locations !== locations) {
      this.manageFocus();
    }
  }

  manageFocus() {
    // const id = window.document.getElementById('#places-list');
    const el = this.refList.current;
    const buttons = PlacesList.slice(el.childNodes);
    const focusedIdx = 0;
    const focusedButton = buttons[focusedIdx];

    // Any more initialization to do here?
    el.setAttribute('role', 'listbox');

    let firstButton = true;
    for (const button of buttons) {
      if (firstButton) {
        button.tabIndex = '0';
        firstButton = false;
      } else {
        button.tabIndex = '-1';
      }

      // What about here?
      button.setAttribute('role', 'option');
    }
    this.setState({ buttons, focusedIdx, focusedButton });
  }

  handleKeyDown(e) {
    const { selectPlace } = this.props;
    const { buttons } = this.state;
    let { focusedIdx } = this.state;
    switch (e.keyCode) {
      case VK_UP:
      case VK_LEFT: {
        e.preventDefault();
        focusedIdx -= 1;
        if (focusedIdx < 0) {
          focusedIdx += buttons.length;
        }
        break;
      }
      case VK_DOWN:
      case VK_RIGHT: {
        e.preventDefault();
        focusedIdx = (focusedIdx + 1) % buttons.length;
        break;
      }
      case VK_ENTER:
      case VK_SPACE: {
        e.preventDefault();
        const focusedButton = e.target;
        const idx = buttons.indexOf(focusedButton);
        if (idx < 0) {
          return;
        }
        focusedIdx = idx;
        selectPlace(e.target.innerText);
        break;
      }
      default:
        return;
    }
    this.changeFocus(buttons, focusedIdx);
  }

  handleClick(e) {
    const { buttons } = this.state;
    let { focusedIdx } = this.state;
    const button = e.target;
    const idx = buttons.indexOf(button);
    if (idx < 0) {
      return;
    }
    focusedIdx = idx;
    this.changeFocus(buttons, focusedIdx);
  }

  changeFocus(buttons, focusedIdx) {
    const { focusedButton } = this.state;
    // Set the old button to tabindex -1
    focusedButton.tabIndex = -1;
    focusedButton.removeAttribute('checked');
    focusedButton.setAttribute('aria-selected', false);

    // Set the new button to tabindex 0 and focus it
    const newFocusedButton = buttons[focusedIdx];
    newFocusedButton.tabIndex = 0;
    newFocusedButton.focus();
    newFocusedButton.setAttribute('checked', '');

    // ... we probably want to do some stuff here, too ...
    newFocusedButton.setAttribute('aria-selected', true);
    this.setState({ focusedButton: newFocusedButton, focusedIdx });
  }

  render() {
    const { locations, selectPlace } = this.props;
    return (
      <ul ref={this.refList} id="places-list" role="listbox">
        {locations.map((location, index) => (
          <li
            ref={this.refListItem}
            key={location.id}
            id={`mi-${index}`}
            className="places-list-item"
            role="option"
            onClick={(event) => { this.handleClick(event); selectPlace(event.target.innerText); }}
            onKeyDown={(event) => { this.handleKeyDown(event); }}
          >
            {location.name}
          </li>
        ))}
      </ul>
    );
  }
}

export default PlacesList;
