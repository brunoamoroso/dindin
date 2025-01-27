CREATE MIGRATION m1aadrkxxxctuqwibj2dohyzy637uoyv5ffb4xk7mjogho5nrjvfua
    ONTO m16et2cxly7sd77arxebxmheueqda5w6ot33ybic4phjifng4tusta
{
  ALTER TYPE default::User {
      CREATE MULTI LINK selectedCoins: default::Coin;
  };
};
