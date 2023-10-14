const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const diskStorage = require("../providers/DiskStorage")


class dishController {
  async create(request, response) {
    const {dishData} = request.body;
    const user_id = request.user.id;
    const DishData = JSON.parse(dishData)
    
    const DiskStorage = new diskStorage()
    const filename = request.file.filename
    const imgurl = await DiskStorage.saveFile(filename)
   
    const newDish = {
      imgurl,
      name: DishData.name,
      category: DishData.category,
      price: DishData.price,
      description: DishData.description,
      user_id,
    }

    const [data] = await knex("newdish").insert(newDish);
    
   if(DishData.ingredients.length !== 0) {
    const ingr = DishData.ingredients.map((item) => {
      return {
        name: item,
        newdish_id: data,
        user_id,
      };
    });

    await knex("ingredients").insert(ingr);
   }
   

    return response.json();

  }

  async update(request, response) {
    const user_id = request.user.id
    const { id } = request.params;
    const { name, category, price, description, ingredients } = request.body
    const dish = await knex("newdish").where({id}).first();
  
    const editDish = {
      name: name ?? dish.name,
      category: category ?? dish.category,
      price: price ?? dish.price,
      description: description ?? dish.description,
    };

    await knex("newdish").where({id}).update(editDish);

    const existingIngredients = await knex("ingredients").where({newdish_id: id});

    const existingIngredientNames = existingIngredients.map(ingredient => ingredient.name);

    const removedIngredients = existingIngredientNames.filter(ingredientName => !ingredients.includes(ingredientName));

    for (const ingredientName of removedIngredients) {
      await knex("ingredients").where({ newdish_id: id, name: ingredientName}).del();
    }

    const newIngredients = ingredients.filter(ingredientName => !existingIngredientNames.includes(ingredientName));

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

    const { id } = request.params;

    const dish = await knex("newdish").where({ id }).first();

    if (!dish) {
      throw new AppError("Não existe esse prato");
    }

    const ingredients = await knex("ingredients").where({newdish_id: id});

  
    return response.json({ ...dish, ingredients});
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
