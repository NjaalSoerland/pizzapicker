import React from "react";
import style from "./pizza.module.css";

export interface PizzaInterface {
  name: string;
  description: string;
  extra: string;
  type: string;
}

interface Props {
  pizza: PizzaInterface;
}

const Pizza: React.FC<Props> = ({ pizza }) => {
  const pizzaType =
    pizza.type === "dessert"
      ? style.candy
      : pizza.type === "tynn"
      ? style.thin
      : pizza.type === "vegansk"
      ? style.vegan
      : style.regular;

  return (
    <div className={pizzaType}>
      <div className={style.name}>{pizza.name}</div>
    </div>
  );
};

export default Pizza;
