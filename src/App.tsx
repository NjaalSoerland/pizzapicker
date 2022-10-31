import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  interface pizzaInterface {
    name: string;
    description: string;
    extra: string;
  }

  const [pizzas, setPizzas] = useState<{
    dessert: pizzaInterface[];
    original: pizzaInterface[];
    tynn: pizzaInterface[];
    vegansk: pizzaInterface[];
  }>({ dessert: [], original: [], tynn: [], vegansk: [] });

  const [activeCatergories, setActiveCatergories] = useState([
    "original",
    "tynn",
    "vegansk",
    "dessert",
  ]);

  const [pizzaOptions, setPizzaOptions] = useState<pizzaInterface[]>([]);

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

  useEffect(() => {
    let pizzaList: pizzaInterface[] = [
      { name: "", description: "", extra: "" },
    ];
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
      Possible options:
      {pizzaOptions.map((pizza) => {
        return <p key={pizza.name}>{pizza.name}</p>;
      })}
    </div>
  );
}

export default App;
