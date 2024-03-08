const up = (knex) => {
  return knex.schema
    .createTable('channel', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.timestamps(true, true);
    })
    .createTable('user', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('role').defaultTo('user');
      table.integer('channelId').references('id').inTable('channel').onDelete('SET NULL');
      table.timestamps(true, true);
    })
    .createTable('video', (table) => {
      table.increments();
      table.string('title').notNullable();
      table.integer('channelId').notNullable().references('id').inTable('channel');
      table.timestamps(true, true);
    });
};

const down = (knex) => {
  return knex.schema
    .dropTableIfExists('video')
    .dropTableIfExists('user')
    .dropTableIfExists('channel');
};

export { up, down };
