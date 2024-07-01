CREATE MIGRATION m16vxzqmsluwavhmque6gvpxnracgzs2tbm2kulptwljeixulwcr2q
    ONTO initial
{
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY password: std::str;
      CREATE REQUIRED PROPERTY surname: std::str;
  };
  CREATE SCALAR TYPE default::AccountType EXTENDING enum<wallet, card>;
  CREATE TYPE default::Account {
      CREATE REQUIRED LINK created_by: default::User;
      CREATE REQUIRED PROPERTY account_type: default::AccountType {
          SET default := (default::AccountType.card);
      };
      CREATE REQUIRED PROPERTY amount: std::int32 {
          SET default := 0;
      };
      CREATE PROPERTY bank: std::str;
      CREATE PROPERTY card_exp_date: cal::local_date;
      CREATE REQUIRED PROPERTY description: std::str;
  };
  CREATE TYPE default::subCategory {
      CREATE LINK created_by: default::User;
      CREATE REQUIRED PROPERTY desc: std::str;
      CREATE REQUIRED PROPERTY is_public: std::bool {
          SET default := false;
      };
  };
  CREATE TYPE default::Category {
      CREATE LINK created_by: default::User;
      CREATE MULTI LINK subCategories: default::subCategory;
      CREATE REQUIRED PROPERTY desc: std::str;
      CREATE REQUIRED PROPERTY is_public: std::bool {
          SET default := false;
      };
  };
  CREATE SCALAR TYPE default::Recurrency EXTENDING enum<`never`, day, week, biweek, month, quarter, semester, annual>;
  CREATE TYPE default::Expense {
      CREATE REQUIRED LINK account: default::Account;
      CREATE REQUIRED LINK category: default::Category;
      CREATE REQUIRED LINK created_by: default::User;
      CREATE REQUIRED PROPERTY amount: std::int32;
      CREATE REQUIRED PROPERTY date_paid: cal::local_date;
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE PROPERTY installments: std::int16;
      CREATE PROPERTY payment_condition: std::str;
      CREATE PROPERTY payment_method: std::str;
      CREATE REQUIRED PROPERTY recurrency: default::Recurrency {
          SET default := (default::Recurrency.`never`);
      };
  };
  CREATE TYPE default::Gain {
      CREATE REQUIRED LINK account: default::Account;
      CREATE REQUIRED LINK category: default::Category;
      CREATE REQUIRED LINK created_by: default::User;
      CREATE REQUIRED PROPERTY amount: std::int32;
      CREATE REQUIRED PROPERTY date_earned: cal::local_date;
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY recurrency: default::Recurrency {
          SET default := (default::Recurrency.`never`);
      };
  };
};
