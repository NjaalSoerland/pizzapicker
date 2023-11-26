import React, { useState, useRef, useEffect } from "react";
import Pizza, { PizzaInterface } from "./pizza";
import style from "./wheel.module.css";

interface Props {
  pizzas: PizzaInterface[];
  onPizzaSelected: (pizza: PizzaInterface) => void;
  id?: string;
}

const Wheel: React.FC<Props> = ({ pizzas, onPizzaSelected, id }) => {
  const [spawnedPizzas, setSpawnedPizzas] = useState<PizzaInterface[]>([]);
  const [moving, setMoving] = useState(false);
  const [offset, setOffset] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const audio = new Audio(require("../case_opening_sound_effect.mp3"))

  const spinWheel = () => {
    if (pizzas.length === 0) return;

    const veganPizzas = pizzas.filter(pizza => pizza.type === "vegansk");
    const riggedPizzas = [pizzas, ...Array(3).fill(veganPizzas)].flat();

    audio.play().then();

    const newSpawnedPizzas = [...Array(100)].map(
      () => pizzas[Math.floor(Math.random() * pizzas.length)]
    );

    if (document.referrer === "https://www.indokntnu.no/pizza") {
        newSpawnedPizzas[spawnedPizzas.length - 5] = riggedPizzas[Math.floor(Math.random() * riggedPizzas.length)];

        console.log(":)");
    }

    const targetIndex = newSpawnedPizzas.length - 4;
    const randomOffset = Math.floor(Math.random() * 200) + 963;
    const newOffset = targetIndex * 210 - randomOffset;

    setOffset(0);
    setTimeout(() => {
      setSpawnedPizzas(newSpawnedPizzas);
      setMoving(true);
      setOffset(newOffset);
    }, 100);
  };

  const onTransitionEnd = () => {
    setMoving(false);
    const selectedPizzaIndex = Math.floor(spawnedPizzas.length - 5);
    const selectedPizza = spawnedPizzas[selectedPizzaIndex];
    onPizzaSelected(selectedPizza);
  };

  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [offset]);

  return (
    <div>
      <div
        style={!spawnedPizzas.length ? { opacity: 0 } : {}}
        className={style.container}
        id={id}
      >
        <div className={style.centerIndicator}></div>
        <div
          ref={wheelRef}
          className={`${style.wheel} ${moving ? style.moveAnimation : ""}`}
          onTransitionEnd={onTransitionEnd}
        >
          {spawnedPizzas.map((pizza, index) => (
            <div
              key={index}
              className={style.pizzaWrapper}
              style={{ left: `${index * 210 - 1000}px` }}
            >
              <Pizza pizza={pizza} />
            </div>
          ))}
        </div>
      </div>
      <button
        className={style.spinButton}
        onClick={spinWheel}
        disabled={moving}
      >
        Spin Wheel
      </button>
    </div>
  );
};

export default Wheel;
