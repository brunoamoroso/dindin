CREATE MIGRATION m12jh5gplu6pt6ssahkddilh4uyakzdmj5u35yodgyvwqnfpjbz5ea
    ONTO m1w4sjfyd422napv7j75xdbt7yszoj5jgkyuzguyxto55f3ba5wfgq
{
  ALTER TYPE default::Account {
      ALTER PROPERTY description {
          RENAME TO desc;
      };
  };
  ALTER TYPE default::Card {
      ALTER PROPERTY description {
          RENAME TO desc;
      };
  };
  ALTER TYPE default::Expense {
      DROP PROPERTY date_paid;
  };
  DROP TYPE default::Expense;
  ALTER TYPE default::Gain {
      DROP PROPERTY date_earned;
  };
  DROP TYPE default::Gain;
  CREATE TYPE default::Transaction {
      CREATE REQUIRED LINK account: default::Account;
      CREATE REQUIRED LINK category: default::Category;
      CREATE REQUIRED LINK created_by: default::User;
      CREATE LINK subCategory: default::subCategory;
      CREATE REQUIRED PROPERTY amount: std::int32;
      CREATE REQUIRED PROPERTY date: cal::local_date;
      CREATE REQUIRED PROPERTY desc: std::str;
      CREATE PROPERTY installments: std::int16;
      CREATE PROPERTY payment_condition: std::str;
      CREATE PROPERTY payment_method: std::str;
      CREATE REQUIRED PROPERTY recurrency: default::Recurrency {
          SET default := (default::Recurrency.`never`);
      };
      CREATE REQUIRED PROPERTY type: std::str {
          CREATE CONSTRAINT std::one_of('Gain', 'Expense');
      };
  };
};
