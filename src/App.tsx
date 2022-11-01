import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

function App() {
  const apiURL = "https://pizzapicker-api.vercel.app/";

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
  const [selectedPizza, setSelectedPizza] = useState<pizzaInterface | null>();
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

  const getRandomPizza = () => {
    const randomPizza = Math.floor(Math.random() * pizzaOptions.length);
    setSelectedPizza(pizzaOptions[randomPizza]);
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
    const button = document.getElementById("getPizza");
    if (button) {
      const buttonPosition = button.getBoundingClientRect();
      setConfettiPosition({
        x: buttonPosition.x,
        y: buttonPosition.y + 50,
        w: buttonPosition.width,
        h: buttonPosition.height,
      });
    }
  };

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
    let pizzaList: pizzaInterface[] = [];
    activeCatergories.forEach((category) => {
      pizzaList = [...pizzaList, ...pizzas[category as keyof typeof pizzas]];
    });
    setPizzaOptions(pizzaList);
  }, [activeCatergories, pizzas]);

  return (
    <div className="App">
      <header>
        <div id={"logoContainer"}>
          <img src={require("./logo.png")} alt={"dumb logo"} />
        </div>
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
            <button onClick={() => getRandomPizza()} id={"getPizza"}>
              Get pizza
            </button>
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
                <h3>Congratulations! You got {selectedPizza.name}!</h3>
                <h3>Description:</h3>
                <div>{selectedPizza.description}</div>
                <h3>Extra:</h3>
                <div>{selectedPizza.extra}</div>
              </div>
            ) : (
              <h3>
                You haven't gotten a pizza yet, click the button above to see
                what you get!
              </h3>
            )}
          </div>
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
