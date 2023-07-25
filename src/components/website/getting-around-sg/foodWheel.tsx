import React, { useState, useEffect, useRef, useCallback } from "react";
import classes from "./foodWheel.module.css";
import { collection, getDocs, getFirestore } from "firebase/firestore";

type Food = {
  id: string;
  name: string;
  foodShopLogo: string;
};

const FoodItem: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);

  const fetchFoods = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "food-wheel")
    );
    const fetchedFoods: Food[] = [];
    querySnapshot.forEach((doc) => {
      const pageData = doc.data() as Food;
      pageData.id = doc.id;
      fetchedFoods.push(pageData);
    });
    setFoods(fetchedFoods);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchFoods();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchFoods]);

  const spinWheel = () => {
    if (wheelRef.current) {
      const wheel = wheelRef.current;
      const wheelItems = wheel.querySelectorAll(
        `.${classes["food-wheel-item"]}`
      );
      const randomIndex = Math.floor(Math.random() * foods.length);
      const randomFood = foods[randomIndex];
      setSelectedFood(randomFood);

      // Reset animation classes
      wheelItems.forEach((item) => {
        item.classList.remove(classes.spinning);
      });

      // Trigger animation
      wheelItems[randomIndex].classList.add(classes.spinning);
    }
  };

  return (
    <div className={classes["food-wheel-container"]}>
      <h1>Food Wheel</h1>
      <div className={classes["food-wheel"]} ref={wheelRef}>
        {foods.map((food) => (
          <div key={food.id} className={classes["food-wheel-item"]}>
            <div className={classes.foodWheelItemContainer}>
              <img
                src={food.foodShopLogo}
                alt="food-shop-logo"
                className={classes.foodShopLogo}
              ></img>
              <p>{food.name}</p>
            </div>
          </div>
        ))}
      </div>
      <button className={classes.button} onClick={spinWheel}>
        Spin the Wheel
      </button>
    </div>
  );
};

export default FoodItem;
