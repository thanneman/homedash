import React from 'react';

export default function Headlines(props) {
  return (
    <>
      <p>
        <a href={props.url} target='_blank' rel='noopener noreferrer'>
          {props.title.slice(0, 40)}... ({props.source.name})
        </a>
      </p>
    </>
  );
}
