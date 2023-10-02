const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class dishController {
  async create(request, response) {
    const { name, category, price, description, ingredients } = request.body;
    const user_id = request.user.id;

    const newDish = {
      name,
      category,
      price,
      description,
      user_id,
    };
    const [data] = await knex("newdish").insert(newDish);

    const ingr = ingredients.map((item) => {
      return {
        name: item,
        newdish_id: data,
        user_id,
      };
    });

    await knex("ingredients").insert(ingr);

    return response.json();
  }

  async update(request, response) {
    const user_id = request.user.id;
    const { id } = request.params;
    const { name, category, price, description, ingredients } = request.body;

    const dish = await knex("newdish")
      .where({ id: id, user_id: user_id })
      .first();

    if (dish.length === 0) {
      throw new AppError("Esse item não existe");
    }

    const editDish = {
      name: name ?? dish.name,
      category: category ?? dish.category,
      price: price ?? dish.price,
      description: description ?? dish.description,
    };

    await knex("newdish").where({ id: id, user_id: user_id }).update(editDish);

    if (!ingredients || ingredients.length == 0) {
      throw new AppError("Ingredientes Obrigatório");
    }
    const existingIngredients = await knex("ingredients").where({
      newdish_id: id,
      user_id,
    });

    const existingIngredientNames = existingIngredients.map(
      (ingredient) => ingredient.name
    );

    const removedIngredients = existingIngredientNames.filter(
      (ingredientName) => !ingredients.includes(ingredientName)
    );

    for (const ingredientName of removedIngredients) {
      await knex("ingredients")
        .where({ newdish_id: id, name: ingredientName, user_id })
        .del();
    }

    const newIngredients = ingredients.filter(
      (ingredientName) => !existingIngredientNames.includes(ingredientName)
    );

    const ingr = newIngredients.map((item) => {
      return {
        name: item,
        newdish_id: id,
        user_id,
      };
    });

    if (!ingr.length == 0) {
      await knex("ingredients").insert(ingr);
    }

    return response.json();
  }

  async delete(request, response) {
    const user_id = request.user.id;
    const { id } = request.params;

    const dish = await knex("newdish").where({ id }).first();

    if (!dish) {
      throw new AppError("Não existe esse prato");
    }

    await knex("newdish").where({ id, user_id }).del();

    return response.status(204).json();
  }

  async show(request, response) {
    const user_id = request.user.id;
    const { id } = request.params;
    const dish = await knex("newdish").where({ id }).first();

    if (!dish) {
      throw new AppError("Não existe esse prato");
    }

    const ingredients = await knex("ingredients").where({
      newdish_id: id,
      user_id,
    });

    const show = {
      dish,
      ingredients,
    };

    return response.json(show);
  }

  async index(request, response) {
    const { title, ingredients } = request.query;

    let tableDish;
    
    if (ingredients) {
      const filterIngredients = ingredients.split(",").map((tag) => tag.trim());
    
      tableDish = await knex("newdish")
        .whereLike("newdish.name", `%${title}%`)
        .whereIn("newdish.id", function() {
          this.select("newdish_id")
            .from("ingredients")
            .whereLike("name", `%${filterIngredients}%`);
        })
        .groupBy("newdish.id")
        .orderBy("newdish.name");

    } else {
      tableDish = await knex("newdish")
        .whereLike("newdish.name", `%${title}%`)
        .orderBy("newdish.id");
    }
    
    const tableIngredients = await knex("ingredients");
    
    const newdishWithIngredients = tableDish.map(dish => {
    const noteIngredients = tableIngredients.filter(ingredient => ingredient.newdish_id === dish.id);

      return {
        ...dish,
        ingredients: noteIngredients,
      }

    })
    
    return response.json(newdishWithIngredients);
}



}


module.exports = dishController;
