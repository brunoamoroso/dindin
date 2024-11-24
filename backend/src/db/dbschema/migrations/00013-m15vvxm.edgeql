CREATE MIGRATION m15vvxmk5fj67vnobucm3cvru2cgoq3tt4ovdx6gcnxanm46fpr2zq
    ONTO m1lrn76nidsoamkjrcxo4mt7kquv7oxmhf5ice67x6opyah4eg2fua
{
  ALTER TYPE default::Transaction {
      CREATE PROPERTY group_installment_id: std::uuid;
  };
};
