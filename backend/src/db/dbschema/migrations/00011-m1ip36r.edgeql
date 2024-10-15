CREATE MIGRATION m1ip36rkar6flqsux7peqgg76jnbcuoq6f33wx53kadeijcbu2pkma
    ONTO m1syr3jbhxvgi3f7cbc4vbwgfamkrcxo5b2ste3oirbsi2jtra2xua
{
  ALTER TYPE default::Transaction {
      ALTER PROPERTY desc {
          RESET OPTIONALITY;
      };
      DROP PROPERTY payment_condition;
  };
};
