CREATE MIGRATION m1gbfr6i43c46njwx23xxhoki5exukimmifug7qosi2uljwsjqlcoq
    ONTO m15vvxmk5fj67vnobucm3cvru2cgoq3tt4ovdx6gcnxanm46fpr2zq
{
  ALTER TYPE default::Transaction {
      CREATE CONSTRAINT std::exclusive ON ((.group_installment_id, .install_number));
  };
};
