import React from 'react';
import styles from './Logo.module.scss';

const Logo: React.FC = () => {
  return (
    <div className={styles.logo}>
      <div className={styles.math}>Math</div>
    </div>
  );
};

export default Logo;
