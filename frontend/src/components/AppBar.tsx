import { ArrowLeft } from "lucide-react";
import { IconButton } from "./ui/icon-button";
import { useNavigate } from "react-router-dom";

interface IAppBar{
    title: string;
    pageBack?: string;
}

export default function AppBar({title, pageBack}: IAppBar) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center h-16 px-1 py-2 gap-1">
        <IconButton variant={"ghost"} onClick={() => {(pageBack) ? navigate("/"+pageBack) : navigate(-1)}}><ArrowLeft /></IconButton>
        <span className="title-small text-content-primary">{title}</span>
    </div>
  )
}
