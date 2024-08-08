CREATE MIGRATION m15ntau6l36u7qvt4axkbfhor57kgtt6vic7ja3acfd6eea3ng34cq
    ONTO m136wqko5p5j2hreyjjfmv7oqsvcbw2su5qd6m3iaftif2uxh7wghq
{
  ALTER TYPE default::Expense {
      CREATE LINK subCategory: default::subCategory;
  };
  ALTER TYPE default::Gain {
      CREATE LINK subCategory: default::subCategory;
  };
};
