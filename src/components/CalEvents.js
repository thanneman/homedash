import React from 'react';
import moment from 'moment';

export default function CalEvents(props) {
  return (
    <>
      <li>
        <span className='cal-header'>
          <a href={props.htmlLink} target='_blank' rel='noopener noreferrer'>
            {props.summary}
          </a>
        </span>
        <p>
          {moment(props.start.dateTime).format('h:mm A')}
          {' - '}
          {moment(props.end.dateTime).format('h:mm A')}
        </p>
      </li>
    </>
  );
}
