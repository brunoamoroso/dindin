import { Input } from "./input";
import { Label } from "./label";
/**
 * The basic usage of this component require that you send an id, a label, if it's required
 * @param 
 * @returns 
 */

interface textFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextField = ({label, ...props} : textFieldProps) => {
  return(
    <Label htmlFor={props.id} className="flex gap-1.5 flex-col w-full">
    {label}
      <Input {...props} />
    </Label>
  );
}

export default TextField;