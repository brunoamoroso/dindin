CREATE MIGRATION m1fp3xluifrahcd3mix5nymboer2qjbnnjatxe6xxmnnmiqu2k42dq
    ONTO m1gbfr6i43c46njwx23xxhoki5exukimmifug7qosi2uljwsjqlcoq
{
  ALTER TYPE default::Account {
      DROP LINK cards;
  };
  DROP TYPE default::Card;
  ALTER TYPE default::Transaction {
      CREATE REQUIRED PROPERTY coin: std::str {
          SET REQUIRED USING (<std::str>{'BRL'});
      };
  };
  DROP SCALAR TYPE default::CardType;
};
