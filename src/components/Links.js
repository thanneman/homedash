import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  faYoutube,
  faInstagram,
  faTwitter,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';

export default function Links() {
  return (
    <>
      <section className='links'>
        <a
          href='https://mail.google.com/mail/u/0/'
          target='_blank'
          rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faEnvelope} size='2x' />
        </a>
        <a
          href='https://www.youtube.com/'
          target='_blank'
          rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faYoutube} size='2x' />
        </a>
        <a
          href='https://www.instagram.com/'
          target='_blank'
          rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faInstagram} size='2x' />
        </a>
        <a
          href='https://twitter.com/'
          target='_blank'
          rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faTwitter} size='2x' />
        </a>
        <a
          href='https://www.reddit.com/'
          target='_blank'
          rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faReddit} size='2x' />
        </a>
      </section>
    </>
  );
}
