import React, { Children } from 'react';
import styles from './styles.module.css';

export function ApiEndpoints({ endpoints }) {
  return (
    <div className={styles.conBox}>
      <div className={styles.conBoxTitle}>Endpoints</div>
      <div className={styles.conBoxContent}>
        {endpoints.map(s =>
        <div key={`${s.m}.${s.p}`} className={styles.endpointDef}>
          <div className={styles.endpointMethod}>{s.m}</div>
          <div className={styles.endpointPath}>{s.p}</div>
        </div>
        )}
      </div>
    </div>
  )
}

export function ApiResource({ data }) {
  return (
    <div className={styles.apiresBlock}>
    <div className={styles.apiresTitle}>
      Resource attributes
    </div>

    {data.map(d =>
      <div key={d.attr} className={styles.apiresRow}>

        <div className={styles.apiresName}>
          {d.attr}
          {d.required ? (<strong>*</strong>) : ''}
        </div>
        <div className={styles.apiresType}>{d.type}</div>

        <div className={styles.apiresDesc}>{d.desc}</div>

      </div>
    )}
    </div>
  );
}
