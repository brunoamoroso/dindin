import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/iconButton";
import { ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="bg-surface h-dvh flex flex-col text-body pt-6">
        <div className="container">
            <div className="flex justify-between">
                <Button variant={"ghost"}>
                    <ChevronDown strokeWidth={2.75} /> Julho
                </Button>
                <Link to={"/transactions"}>
                    <IconButton>
                        <Plus />
                    </IconButton>
                </Link>
            </div>
        </div>
    </div>
  )
}
