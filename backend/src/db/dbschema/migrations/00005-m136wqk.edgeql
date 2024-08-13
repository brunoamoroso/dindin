CREATE MIGRATION m136wqko5p5j2hreyjjfmv7oqsvcbw2su5qd6m3iaftif2uxh7wghq
    ONTO m1yj2x4aads7aoylb4upb5lrpuyd6fmh3w7abxfozz3tvu7qprjnkq
{
  CREATE SCALAR TYPE default::CardType EXTENDING enum<credit, debit, credit_debit>;
  CREATE TYPE default::Card {
      CREATE PROPERTY card_exp_date: cal::local_date;
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY type: default::CardType;
  };
  ALTER TYPE default::Account {
      CREATE MULTI LINK cards: default::Card;
  };
  ALTER TYPE default::Account {
      DROP PROPERTY account_type;
  };
  ALTER TYPE default::Account {
      DROP PROPERTY card_exp_date;
  };
  DROP SCALAR TYPE default::AccountType;
};
