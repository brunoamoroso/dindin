CREATE MIGRATION m1eylcj7rqjallssglzdwnexqvotfn5dfygfrbdrxkgljy5v3k3sha
    ONTO m1tihz2wrm4qog4wsnlmifofd5kojw6fxhpjkkmrorbvnmg2i5b25a
{
  CREATE SCALAR TYPE default::CategoryType EXTENDING enum<gain, expense>;
  ALTER TYPE default::Category {
      CREATE REQUIRED PROPERTY type: default::CategoryType {
          SET REQUIRED USING (<default::CategoryType>{'gain'});
      };
  };
};
