import { describe, expect, expectTypeOf, it } from "vitest";
import { Coffee } from "./barista";
import { Ingredient } from "./barista";
import { Barista } from "./barista";

describe("Coffee", () => {
	it("crée un café avec un nom et un prix", () => {
		const coffee = new Coffee("Cappuccino", 4);

		expect(coffee.name).toBe("Cappuccino");
		expect(coffee.price).toBe(4);
	});

	it("ajoute un ingrédient à la recette", () => {
		const coffee = new Coffee("Cappuccino", 4);

		coffee.addIngredient("lait", 4);

		expect(coffee.ingredients).toHaveLength(1);
		expect(coffee.ingredients[0]).toEqual({
			name: "lait",
			quantity: 4
		});
		
		expect(coffee.ingredients[0]).not.toEqual({
			name: "café",
			quantity: 3
		});
	});
});

describe("Ingredient", () => {
	it("ajoute une quantité au stock", () => {
		const ingredient = new Ingredient("cacao", 10);
		
		ingredient.addQuantity(5);
		
		expect(ingredient.quantity).not.toBe(10);
		expect(ingredient.quantity).toEqual(15);

	});

	it("retire une quantité du stock", () => {
		const ingredient = new Ingredient("cacao", 10);

		ingredient.removeQuantity(1);

		expect(ingredient.quantity).toBeLessThan(10);
		
	});

	it("refuse de retirer une quantité supérieure au stock", () => {
		const ingredient = new Ingredient("cacao", 10);

		const removedQuantity = ingredient.removeQuantity(20);

		expect(removedQuantity).toBeFalsy();
		expect(removedQuantity).toBe(false);

		expect(ingredient.quantity).toEqual(10);
	});
});

describe("Barista", () => {
	it("ajoute un café à sa liste de cafés", () => {
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		barista.addCoffee(coffee);

		expect(barista.coffees).toHaveLength(1);
		expect(barista.coffees).toContain(coffee);
	});

	it("retourne undefined lorsqu'un café n'existe pas", () => {
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		barista.addCoffee(coffee);
		const getCoffee = barista.getCoffee("Mocaccino");
		
		expect(barista.coffees).toHaveLength(1);
		expect(getCoffee).toBe(undefined);
		expect(getCoffee).toBeUndefined();
	});

	it("peut préparer un café lorsque tous les ingrédients sont disponibles", () => {
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		coffee.addIngredient("Blue mountain", 2);

		barista.addCoffee(coffee);

		barista.addIngredient("Moka", 20);
		barista.addIngredient("Blue mountain", 10);
		barista.addIngredient("Java", 10);

		const canMakeCoffee = barista.canMakeCoffee(coffee);

		expect(canMakeCoffee).toBe(true);
		expect(canMakeCoffee).toBeTruthy();

	});

	it("ne peut pas préparer un café lorsqu'un ingrédient est manquant", () => {
		
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		coffee.addIngredient("Temen", 2);

		barista.addCoffee(coffee);

		barista.addIngredient("Moka", 20);
		barista.addIngredient("Blue mountain", 10);
		barista.addIngredient("Java", 10);

		const canMakeCoffee = barista.canMakeCoffee(coffee);

		expect(canMakeCoffee).toBe(false);
		expect(canMakeCoffee).not.toBeTruthy();
	});

	it("ne peut pas préparer un café lorsque la quantité est insuffisante", () => {
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		coffee.addIngredient("Moka", 5);

		barista.addCoffee(coffee);

		barista.addIngredient("Moka", 2);
		barista.addIngredient("Blue mountain", 10);
		barista.addIngredient("Java", 10);

		const canMakeCoffee = barista.canMakeCoffee(coffee);

		expect(canMakeCoffee).toBe(false);
	});

	it("consomme les ingrédients lorsqu'il prépare un café", () => {
		// tester makeCoffee
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		coffee.addIngredient("Blue mountain", 2);

		barista.addCoffee(coffee);

		barista.addIngredient("Moka", 20);
		barista.addIngredient("Blue mountain", 10);
		barista.addIngredient("Java", 10);

		barista.canMakeCoffee(coffee);
		const makeCoffee = barista.makeCoffee(coffee);

		expect(makeCoffee).toBeTruthy();
		expect(barista.ingredients[1].quantity).toBeLessThan(10);
	});

	it("ne consomme rien lorsqu'il ne peut pas préparer le café", () => {
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		coffee.addIngredient("Blue mountain", 5);

		barista.addCoffee(coffee);

		barista.addIngredient("Moka", 20);
		barista.addIngredient("Blue mountain", 2);
		barista.addIngredient("Java", 10);

		barista.canMakeCoffee(coffee);
		const makeCoffee = barista.makeCoffee(coffee);

		expect(makeCoffee).toBeFalsy();
		expect(barista.ingredients[1].quantity).toEqual(2);

	});

	it("retourne le prix lorsqu'un café est commandé", () => {
		const coffee = new Coffee("Expresso", 2);
		const barista = new Barista("Jane");

		coffee.addIngredient("Blue mountain", 2);

		barista.addCoffee(coffee);

		barista.addIngredient("Moka", 20);
		barista.addIngredient("Blue mountain", 10);
		barista.addIngredient("Java", 10);

		barista.canMakeCoffee(coffee);
		barista.makeCoffee(coffee);

		const orderCoffee = barista.orderCoffee("Expresso");

		expect(orderCoffee).toEqual(2);
	});
});
