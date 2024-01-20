import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { PizzaInterface } from "./components/pizza";
import Wheel from "./components/wheel";
import { useQuery } from "react-query";
import TabMenu, { Tab } from "./components/tabmenu";

type PizzaCategory = "dessert" | "original" | "tynn" | "vegansk";
const pizzaCategoryNames: PizzaCategory[] = ["dessert", "original", "tynn", "vegansk"];

function App() {
  const apiURL = "https://pizzapicker-api.vercel.app/";

  const { data: pizzaCategories, isLoading, error } = useQuery("pizzas", async () => {
    const pizzaCategories = (await axios.get<Record<PizzaCategory, PizzaInterface[]>>(apiURL)).data
    for (const category of pizzaCategoryNames) {
	for (const pizza of pizzaCategories[category] ?? []) {
		pizza.type = category;
	}
    }
    return pizzaCategories;
  });

  const [activeCategories, setActiveCategories] = useState<PizzaCategory[]>(pizzaCategoryNames);

  const pizzaOptions = pizzaCategoryNames
    .filter(category => activeCategories.includes(category)) 
    .map(category => pizzaCategories?.[category])
    .flatMap(pizzas => pizzas ?? []);

  const [selectedPizza, setSelectedPizza] = useState<PizzaInterface | null>();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState({
    x: 0,
    y: 0,
    w: window.innerWidth,
    h: 0,
  });

  const handleChange = (type: PizzaCategory) => {
    if (activeCategories.includes(type)) {
      setActiveCategories(activeCategories.filter((item) => item !== type));
    } else {
      setActiveCategories([...activeCategories, type]);
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

  const tabs: Tab[] = [
    { 
        name: 'Options', 
        content: (
            <div id="possiblePizzas">
                <h1 id="possiblePizzasTitle">Options:</h1>
                {isLoading ? <div>Loading...</div> : (
                    pizzaOptions.map((pizza, index) => (
                        <p key={pizza.name + index.toString()}>{pizza.name}</p>
                    ))
                )}
            </div>
        ) 
    },
    { 
        name: 'Order', 
        content: <div>Content for Order</div> // Replace with actual content
    }
];


  return (
    <div className="App">
      <header>
        <div id={"logoContainer"}>
          <img src={require("./logo.png")} alt={"dumb logo"} width={420} height={125} />
        </div>
        <a href="https://github.com/NjaalSoerland">
          <img src={require("./images/github.png")} alt="" width={90} height={90} />
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
            {pizzaCategoryNames.filter(categoryName => pizzaCategories?.[categoryName]?.length ?? 0 > 0)
            .map(type => (
                <div key={type} style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    onChange={() => handleChange(type)}
                    id={type}
                    defaultChecked
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              )
            )}
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
        <TabMenu tabs={tabs} />
      </div>
    </div>
  );
}

export default App;
