import { createAccount } from "@/api/accountService";
import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

export function CreateAccount(){
    const [description, setDescription] = useState("");
    const {toast} = useToast();

    const mutate = useMutation({
        mutationFn: (description: string) => createAccount({description}),
        onSuccess: () => {
            toast({
                title: (
                    <div className="flex gap-3 items-center">
                        <CircleCheck />
                        <span>Conta criada!</span>
                    </div>
                ),
                variant: "positive",
                duration: 2000,
            })
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate.mutate(description);
    }

    return (
        <div className="bg-surface min-h-dvh flex flex-col">
            <AppBar title="Criar conta" />
            <div className="container flex flex-col flex-1 bg-container2 rounded-t-lg py-10">
                <form className="flex flex-col flex-1 justify-between" onSubmit={handleSubmit}>
                    <TextField
                        id="description"
                        label="Nome da conta"
                        value={description}
                        placeholder="Escreva o nome da conta"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button variant="default" size="lg" type="submit">
                        Criar
                    </Button>
                </form>
            </div>

        </div>
    )
}