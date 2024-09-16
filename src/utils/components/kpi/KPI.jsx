import React from 'react';
import styles from './KPI.module.css';

const Kpi = ({ title, count }) => {
    return (
        <div className={styles["box-counter"]}>
            <p className={styles["title"]}>{title}</p>
            <span className={styles["count"]}>
                {count}
            </span>
        </div>
    );
}


export default Kpi;