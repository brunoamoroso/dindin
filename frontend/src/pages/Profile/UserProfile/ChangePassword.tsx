import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import PasswordValidator from "@/components/ui/passwordvalidator";
import TextField from "@/components/ui/textfield";
import { useToast } from "@/components/ui/use-toast";
import { passwordCheck } from "@/utils/password-check";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { changePassword } from "@/api/profileService";

const rules = ["Maiúscula", "Minúscula", "Número", "8 Dígitos", "Símbolo"];

export function ChangePassword() {
  const [passwordData, setpasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [validations, setValidations] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    minLength: false,
    hasSymbol: false,
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setpasswordData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePasswordValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const passValidations = passwordCheck(password);
    setValidations(passValidations);

    setpasswordData((prev) => ({
      ...prev,
      newPassword: password,
    }));

    if (!Object.values(passValidations).every((check) => check === true)) {
      setPasswordValid(false);
      return;
    }

    setPasswordValid(true);
  };

  const mutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => {
      return changePassword(data);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordValid) {
      toast({
        title: (
            <div className="flex gap-3 items-center">
              <CircleX />
              A senha não preenche os requisitos necessários
            </div>
          ),
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    mutation.mutate(passwordData, {
      onSuccess: () => {
        toast({
          title: (
            <div className="flex gap-3 items-center">
              <CircleCheck />
              Senha atualizada!
            </div>
          ),
          variant: "positive",
          duration: 1000,
        });
      },
      onError: (err) => {
        console.error(err);
        const errorMessage =
          (err as Error).message || "Erro desconhecido. Tente novamente.";
        toast({
          title: (
            <div className="flex gap-3 items-center">
              <CircleX />
              {errorMessage}
            </div>
          ),
          variant: "destructive",
          duration: 2000,
        });
      },
    });
  };

  return (
    <div className="bg-surface min-h-dvh flex flex-1 flex-col">
      <AppBar title="Mudar Senha" />
      <div className="container flex flex-1 flex-col py-10">
        <form
          className="flex flex-col gap-10 flex-1 justify-between"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6">
            <TextField
              type="password"
              id="oldPassword"
              label="Senha atual"
              required={true}
              onChange={handleChange}
            />
            <div className="flex flex-col gap-2.5">
              <TextField
                type="password"
                id="newPassword"
                label="Nova Senha"
                required={true}
                onChange={handlePasswordValidation}
              />
              <PasswordValidator validations={validations} rules={rules} />
            </div>
          </div>

          <Button size={"lg"} type="submit" className={cn("w-full", `${mutation.isPending && "opacity-50 cursor-not-allowed pointer-events-none"}`)}>
            {mutation.isPending ? (
              <div className="flex items-center gap-2">
                <LoaderCircle size={16} className="animate-spin" />
                Carregando
              </div>
            ) : ("Salvar")}
          </Button>
        </form>
      </div>
    </div>
  );
}
