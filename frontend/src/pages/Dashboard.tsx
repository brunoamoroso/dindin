import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/iconButton";
import { ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="bg-surface h-dvh flex flex-col text-body">
        <div className="container">
            <div className="flex justify-between py-6">
                <Button variant={"ghost"}>
                    <ChevronDown /> Julho
                </Button>
                <Link to={"/transactions"}>
                    <IconButton>
                        <Plus strokeWidth={3}/>
                    </IconButton>
                </Link>
            </div>
            <div className="flex gap-6">
                <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
                    <span className="label-small text-title">Você ganhou</span>
                    <span className="title-medium text-positive">R$10.000</span>
                </div>
                <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
                    <span className="label-small text-title">Você gastou</span>
                    <span className="title-medium text-negative">R$10.000</span>
                </div>
            </div>
        </div>
    </div>
  )
}
