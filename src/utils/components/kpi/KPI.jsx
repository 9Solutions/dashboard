import React from 'react';
import styles from './KPI.module.css';

const Kpi = ({ title, count, comparison, isIncrease }) => {
    return (
        <div className={styles["box-counter"]}>
            <p className={styles["title"]}>{title}</p>
            <span className={styles["count"]}>
                {count}
            </span>
            <p className={styles["comparison"]}>
                Comparado a Semana Anterior:
                <span>
                    <span className={styles[`${isIncrease ? 'arrow-up' : 'arrow-down'}`]}>
                        {isIncrease ? '▲' : '▼'}
                    </span>
                    {comparison}%
                </span>
            </p>
        </div>
    );
}


export default Kpi;