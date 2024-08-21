CREATE MIGRATION m1syr3jbhxvgi3f7cbc4vbwgfamkrcxo5b2ste3oirbsi2jtra2xua
    ONTO m12jh5gplu6pt6ssahkddilh4uyakzdmj5u35yodgyvwqnfpjbz5ea
{
  ALTER TYPE default::Transaction {
      ALTER PROPERTY type {
          DROP CONSTRAINT std::one_of('Gain', 'Expense');
      };
  };
  ALTER TYPE default::Transaction {
      ALTER PROPERTY type {
          CREATE CONSTRAINT std::one_of('gain', 'expense');
      };
  };
};
