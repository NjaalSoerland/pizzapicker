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
  const [activeCatergories, setActiveCatergories] = useState([
    "original",
    "tynn",
    "vegansk",
    "dessert",
  ]);
  const [pizzaOptions, setPizzaOptions] = useState([""]);

  const handleChange = (type: string) => {
    if (activeCatergories.includes(type)) {
      setActiveCatergories(activeCatergories.filter((item) => item !== type));
    } else {
      setActiveCatergories([...activeCatergories, type]);
    }
  };

  const apiURL = "http://localhost:5000";

  useEffect(() => {
    axios
      .get(apiURL)
      .then((response) => {
        setPizzas(response.data);
        setActiveCatergories(Object.keys(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Crete one list with all the pizzas from the active categories
  useEffect(() => {
    let pizzaList: string[] = [];
    activeCatergories.forEach((category) => {
      pizzaList = [...pizzaList, ...pizzas[category as keyof typeof pizzas]];
    });
    setPizzaOptions(pizzaList);
  }, [activeCatergories, pizzas]);

  return (
    <div className="App">
      {Object.keys(pizzas).map((type) => {
        return (
          <div key={type}>
            <input
              type="checkbox"
              onChange={() => handleChange(type)}
              defaultChecked
            />
            <label>{type}</label>
          </div>
        );
      })}
      {pizzaOptions.map((pizza) => {
        return <p key={pizza}>{pizza}</p>;
      })}
    </div>
  );
}

export default App;
