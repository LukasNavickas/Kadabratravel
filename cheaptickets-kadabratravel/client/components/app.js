import React from 'react';
import Header from './header';
import FirstCarousel from './bins/first_carousel';
import FirstDepart from './bins/first_depart';

export default (props) => {
  return (
    <div>
      <Header />
      <FirstCarousel />
      <FirstDepart />
      {props.children}
    </div>
  );
};
