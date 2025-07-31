import styles from '../LoaderM/LoaderM.module.scss'

function Loader() {
  return (
    <div className={styles.loader}>
      <svg
        className={styles.loader__svg}
        width="80"
        height="80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={styles.loader__path}
          d="M 10 80 L 44 26 L 52 43 L 65 21 L 80 47"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.loader__text}>Dev.</span>
    </div>
  );
}

export default Loader;