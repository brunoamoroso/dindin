import { Input } from "./input";
import { Label } from "./label";

const TextField = ({id, label} : {id: string; label: string}) => {
  return (
    <div className="flex gap-1.5 flex-col w-full">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} />
    </div>
  );
}

export default TextField;