CREATE MIGRATION m1b54chptrnjnacaxuapc5clpxiop6oqo3lyfyoigcm2crty3xowxa
    ONTO m1aadrkxxxctuqwibj2dohyzy637uoyv5ffb4xk7mjogho5nrjvfua
{
  ALTER TYPE default::User {
      CREATE REQUIRED LINK user_default_coin: default::Coin {
          SET REQUIRED USING (<default::Coin>{(SELECT
              default::Coin
          FILTER
              (.id = <std::uuid>'832e02da-db4f-11ef-8e0f-e36577de56f2')
          )});
      };
  };
};
