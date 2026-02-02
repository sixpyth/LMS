import React from "react";
import MainContent from "../components/MainContent";
import styles from './Home.module.css'; 

function Home() {
  return (
    <div className={styles.homePage}> 
      <div className={styles.mainContent}> 
        <MainContent />
      </div>
    </div>
  );
}

export default Home;