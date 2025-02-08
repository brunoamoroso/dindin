CREATE MIGRATION m16et2cxly7sd77arxebxmheueqda5w6ot33ybic4phjifng4tusta
    ONTO m1fp3xluifrahcd3mix5nymboer2qjbnnjatxe6xxmnnmiqu2k42dq
{
  CREATE TYPE default::Coin {
      CREATE REQUIRED PROPERTY code: std::str;
      CREATE REQUIRED PROPERTY desc: std::str;
      CREATE PROPERTY img: std::str;
  };
  ALTER TYPE default::Transaction {
      DROP PROPERTY coin;
  };
  ALTER TYPE default::Transaction {
      CREATE REQUIRED LINK coin: default::Coin {
          SET REQUIRED USING (<default::Coin>{(INSERT
              default::Coin
              {
                  desc := 'Real Brasileiro',
                  code := 'BRL'
              })});
      };
  };
};
