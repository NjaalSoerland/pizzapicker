import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { PizzaInterface } from "./components/pizza";
import Wheel from "./components/wheel";

function App() {
  const apiURL = "https://pizzapicker-api.vercel.app/";

  const [pizzas, setPizzas] = useState<{
    dessert: PizzaInterface[];
    original: PizzaInterface[];
    tynn: PizzaInterface[];
    vegansk: PizzaInterface[];
  }>({ dessert: [], original: [], tynn: [], vegansk: [] });

  const [activeCatergories, setActiveCatergories] = useState([
    "original",
    "tynn",
    "vegansk",
    "dessert",
  ]);

  const [pizzaOptions, setPizzaOptions] = useState<PizzaInterface[]>([]);
  const [selectedPizza, setSelectedPizza] = useState<PizzaInterface | null>();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState({
    x: 0,
    y: 0,
    w: window.innerWidth,
    h: 0,
  });

  const handleChange = (type: string) => {
    if (activeCatergories.includes(type)) {
      setActiveCatergories(activeCatergories.filter((item) => item !== type));
    } else {
      setActiveCatergories([...activeCatergories, type]);
    }
  };

  const handlePizzaSelected = (pizza: PizzaInterface) => {
    console.log("Selected pizza:", pizza.name);
    setSelectedPizza(pizza);
    setConfettiPositionOnButton();
    if (pizzaOptions.length) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

  const setConfettiPositionOnButton = () => {
    // get the position of the button with the id "getPizza"
    const button = document.getElementById("selection");
    if (button) {
      const buttonPosition = button.getBoundingClientRect();
      setConfettiPosition({
        x: buttonPosition.x + buttonPosition.width / 2,
        y: buttonPosition.y,
        w: 50,
        h: buttonPosition.height,
      });
    }
  };

  useEffect(() => {
    axios
      .get(apiURL)
      .then((response) => {
        Object.keys(response.data).forEach((category) => {
          response.data[category].forEach((pizza: PizzaInterface) => {
            pizza.type = category;
          });
        });
        setPizzas(response.data);
        setActiveCatergories(Object.keys(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let pizzaList: PizzaInterface[] = [];
    activeCatergories.forEach((category) => {
      pizzaList = [...pizzaList, ...pizzas[category as keyof typeof pizzas]];
    });
    setPizzaOptions(pizzaList);
  }, [activeCatergories, pizzas]);

  return (
    <div className="App">
      <header>
        <div id={"logoContainer"}>
          <img src={require("./logo.png")} alt={"dumb logo"} width={420} height={125} />
        </div>
        <a href="https://github.com/NjaalSoerland">
          <img src={require("./images/github.png")} alt="" />
        </a>
      </header>
      <div id={"content"}>
        <img
          src={require("./images/almost_pizza.png")}
          alt={"pizza"}
          id={"pizzaOne"}
        />
        <img
          src={require("./images/eating_pizza.png")}
          alt={"pizza"}
          id={"pizzaTwo"}
        />
        <img
          src={require("./images/pizza_slice.png")}
          alt={"pizza"}
          id={"pizzaThree"}
        />
        <div id={"selection"}>
          <div id={"options"}>
            {Object.keys(pizzas).map((type) => {
              return (
                <div key={type}>
                  <input
                    type="checkbox"
                    onChange={() => handleChange(type)}
                    id={type}
                    defaultChecked
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              );
            })}
          </div>
          <div id={"selectedPizza"}>
            {showConfetti ? (
              <Confetti
                numberOfPieces={20}
                recycle={false}
                colors={["#761f18", "#faac18", "#fff1c1", "#fee39f"]}
                gravity={0.5}
                initialVelocityY={20}
                initialVelocityX={30}
                confettiSource={confettiPosition}
              />
            ) : null}
            {selectedPizza ? (
              <div>
                <div id="notification" />
                <h3>Congratulations! You got {selectedPizza.name}!</h3>
                <h3>Description:</h3>
                <div>{selectedPizza.description}</div>
                <h3>Extra:</h3>
                <div>{selectedPizza.extra}</div>
              </div>
            ) : (
              <h3>
                You haven't gotten a pizza yet, spin the wheel to see what you
                get!
              </h3>
            )}
          </div>
          <Wheel pizzas={pizzaOptions} onPizzaSelected={handlePizzaSelected} />{" "}
        </div>
        <div id={"possiblePizzas"}>
          <h1 id={"possiblePizzasTitle"}>Possible options:</h1>
          {pizzaOptions.length ? (
            pizzaOptions.map((pizza) => {
              return <p key={pizza.name}>{pizza.name}</p>;
            })
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
