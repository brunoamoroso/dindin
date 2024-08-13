import { ArrowLeft } from "lucide-react";
import { IconButton } from "./ui/icon-button";
import { useNavigate } from "react-router-dom";

interface IAppBar{
    title: string;
}

export default function AppBar({title}: IAppBar) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center h-16 px-1 py-2 gap-1">
        <IconButton variant={"ghost"} onClick={() => {navigate(-1)}}><ArrowLeft /></IconButton>
        <span className="title-small text-title">{title}</span>
    </div>
  )
}
