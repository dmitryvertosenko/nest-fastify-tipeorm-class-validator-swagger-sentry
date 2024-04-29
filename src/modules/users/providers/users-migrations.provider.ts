export class UsersMigrationsProvider {
  static seedTestUser = {
    createQuery: /*sql*/ `
      INSERT INTO customers ("name", "email", "password")
      VALUES ('John Doe', 'example@email.com', md5('12345678'))
    `,

    dropQuery: /*sql*/ `
      DELETE FROM customers
      WHERE "name" = 'John Doe'
    `,
  };
}
