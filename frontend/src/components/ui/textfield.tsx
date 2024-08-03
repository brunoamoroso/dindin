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
    <div className="flex gap-1.5 flex-col w-full">
        <Label htmlFor={props.id}>{label}</Label>
        <Input {...props} />
    </div>
  );
}

export default TextField;