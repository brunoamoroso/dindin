CREATE MIGRATION m1bkkav7s4vpn2cztzd7t7kpkh3xb27s6tamhxefwoo5j573soietq
    ONTO m15ntau6l36u7qvt4axkbfhor57kgtt6vic7ja3acfd6eea3ng34cq
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY username: std::str {
          SET REQUIRED USING (<std::str>{(.name ++ .surname)});
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
