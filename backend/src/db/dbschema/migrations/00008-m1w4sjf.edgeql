CREATE MIGRATION m1w4sjfyd422napv7j75xdbt7yszoj5jgkyuzguyxto55f3ba5wfgq
    ONTO m1bkkav7s4vpn2cztzd7t7kpkh3xb27s6tamhxefwoo5j573soietq
{
  ALTER TYPE default::Expense {
      ALTER PROPERTY date_paid {
          SET TYPE cal::local_datetime;
      };
      ALTER PROPERTY payment_condition {
          SET REQUIRED USING (<std::str>{'single'});
      };
      ALTER PROPERTY payment_method {
          SET REQUIRED USING (<std::str>{'credit'});
      };
  };
  ALTER TYPE default::Gain {
      ALTER PROPERTY date_earned {
          SET TYPE cal::local_datetime;
      };
  };
};
