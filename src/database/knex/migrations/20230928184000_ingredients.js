exports.up = knex => knex.schema.createTable("ingredients", table => {
    table.increments('id').primary();
    table.string('name'); 
    table.integer('newdish_id').references('id').inTable("newdish").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");

})


exports.down = knex => knex.schema.dropTable("ingredients")
