CREATE MIGRATION m1lrn76nidsoamkjrcxo4mt7kquv7oxmhf5ice67x6opyah4eg2fua
    ONTO m1ip36rkar6flqsux7peqgg76jnbcuoq6f33wx53kadeijcbu2pkma
{
  ALTER TYPE default::Transaction {
      CREATE PROPERTY install_number: std::int16;
  };
  ALTER TYPE default::Transaction {
      ALTER PROPERTY payment_method {
          RENAME TO payment_condition;
      };
  };
};
