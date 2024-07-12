CREATE MIGRATION m1tihz2wrm4qog4wsnlmifofd5kojw6fxhpjkkmrorbvnmg2i5b25a
    ONTO m16vxzqmsluwavhmque6gvpxnracgzs2tbm2kulptwljeixulwcr2q
{
  ALTER TYPE default::User {
      CREATE PROPERTY photo: std::str;
  };
};
