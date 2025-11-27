import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NewsArchive from "./components/card/NewsArchive";
import { Header } from "./components/header/Header";
import styles from "./styles/Main.module.scss";

function App() {
  return (
    <Router>
      <Header/>
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<NewsArchive />} />
          <Route path="/general" element={<NewsArchive />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;