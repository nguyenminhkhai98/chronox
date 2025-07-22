import React from 'react';
import './Card.scss';

interface CardProps {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  interactive = false, 
  className = '',
  onClick 
}) => {
  const classes = [
    'card',
    interactive && 'card--interactive',
    className
  ].filter(Boolean).join(' ');

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent 
      className={classes} 
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </CardComponent>
  );
};

export default Card;