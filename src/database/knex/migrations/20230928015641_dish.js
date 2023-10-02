exports.up = knex => knex.schema.createTable("newdish", table => {
    table.increments('id').primary();
    table.string('imgurl'); 
    table.string('name'); 
    table.string('category'); 
    table.string('price'); 
    table.text('description');
    table.integer('user_id').references('id').inTable("users")
})


exports.down = knex => knex.schema.dropTable("newdish")
