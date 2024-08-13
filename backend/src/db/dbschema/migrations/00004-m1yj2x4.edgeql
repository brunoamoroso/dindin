CREATE MIGRATION m1yj2x4aads7aoylb4upb5lrpuyd6fmh3w7abxfozz3tvu7qprjnkq
    ONTO m1eylcj7rqjallssglzdwnexqvotfn5dfygfrbdrxkgljy5v3k3sha
{
  ALTER TYPE default::Category {
      ALTER LINK created_by {
          SET REQUIRED USING (<default::User>{<std::uuid>'4a673ab0-43bb-11ef-a0e2-7ff173b8fdd1'});
      };
  };
};
