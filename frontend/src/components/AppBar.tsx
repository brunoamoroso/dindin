import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface IAppBar{
    title: string;
}

export default function AppBar({title}: IAppBar) {
  return (
    <div className="flex items-center">
        <Button variant={'ghost'} className="neutral-50"><ArrowLeft /></Button>
        <span className="text-title">{title}</span>
    </div>
  )
}
