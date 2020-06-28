import React, { Component } from 'react';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  faYoutube,
  faInstagram,
  faTwitter,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      weather: [],
      headlines: [],
      error: null,
    };
  }

  // update search state
  updateSearch(search) {
    this.setState({ search });
  }

  // handle search and open in new tab
  handleSubmit(e) {
    e.preventDefault();
    const usersearch = `https://www.google.com/search?q=${this.state.search}`;
    window.open(usersearch, '_blank');
  }

  render() {
    return (
      <main className='app'>
        <section className='search'>
          <form className='search-form' onSubmit={(e) => this.handleSubmit(e)}>
            <input
              type='search'
              results='3'
              id='search'
              name='search'
              placeholder='Search Google'
              onChange={(e) => this.updateSearch(e.target.value)}
            />
          </form>
        </section>
        <section className='links'>
          <a
            href='https://mail.google.com/mail/u/0/'
            target='_blank'
            rel='noopener noreferrer'>
            <FontAwesomeIcon icon={faEnvelope} size='sm' />
          </a>
          <a
            href='https://www.youtube.com/'
            target='_blank'
            rel='noopener noreferrer'>
            <FontAwesomeIcon icon={faYoutube} size='sm' />
          </a>
          <a
            href='https://www.instagram.com/'
            target='_blank'
            rel='noopener noreferrer'>
            <FontAwesomeIcon icon={faInstagram} size='sm' />
          </a>
          <a
            href='https://twitter.com/'
            target='_blank'
            rel='noopener noreferrer'>
            <FontAwesomeIcon icon={faTwitter} size='sm' />
          </a>
          <a
            href='https://www.reddit.com/'
            target='_blank'
            rel='noopener noreferrer'>
            <FontAwesomeIcon icon={faReddit} size='sm' />
          </a>
        </section>
        <section className='weather'></section>
        <section className='headlines'></section>
      </main>
    );
  }
}
export default App;
