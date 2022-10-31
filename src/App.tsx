import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [pizzas, setPizzas] = useState({
    dessert: [],
    original: [],
    tynn: [],
    vegansk: [],
  });

  const apiURL = "http://localhost:5000";

  useEffect(() => {
    axios
      .get(apiURL)
      .then((response) => {
        setPizzas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <div className="App">{pizzas.original}</div>;
}

export default App;
