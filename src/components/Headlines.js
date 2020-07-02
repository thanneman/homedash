import React from 'react';

export default function Headlines(props) {
  return (
    <>
      <p>
        <a href={props.link} target='_blank' rel='noopener noreferrer'>
          {props.title.slice(0, 55)}...
        </a>
      </p>
    </>
  );
}
