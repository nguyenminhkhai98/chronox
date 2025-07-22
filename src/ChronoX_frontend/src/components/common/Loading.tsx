import React from 'react';
import './Loading.scss';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  fullPage = false 
}) => {
  const classes = [
    'loading',
    `loading--${size}`,
    fullPage && 'loading--fullpage'
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="loading__spinner" />
      {text && <div className="loading__text">{text}</div>}
    </div>
  );
};

export default Loading;