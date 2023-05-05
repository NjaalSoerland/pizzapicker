// Wheel.tsx
import React, { useState, useRef, useEffect } from "react";
import Pizza, { PizzaInterface } from "./pizza";
import style from "./wheel.module.css";

interface Props {
  pizzas: PizzaInterface[];
}

const Wheel: React.FC<Props> = ({ pizzas }) => {
  const [spawnedPizzas, setSpawnedPizzas] = useState<PizzaInterface[]>([]);
  const [moving, setMoving] = useState(false);
  const [offset, setOffset] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    const newSpawnedPizzas = [...Array(100)].map(
      () => pizzas[Math.floor(Math.random() * pizzas.length)]
    );
    console.log(newSpawnedPizzas);

    const targetIndex = newSpawnedPizzas.length - 4;
    const randomOffset = Math.floor(Math.random() * 100) - 50; // Random number between -50 and 50
    const newOffset = targetIndex * 200 + randomOffset;

    // Reset the wheel
    setOffset(0);

    // Schedule a new spin after resetting the wheel
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
    console.log("Selected pizza:", selectedPizza.name);
  };

  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [offset]);

  return (
    <div className={style.container}>
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
            style={{ left: `${index * 200}px` }}
          >
            <Pizza pizza={pizza} />
          </div>
        ))}
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
