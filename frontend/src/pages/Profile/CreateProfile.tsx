import api from "@/api/api";
import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordValidator from "@/components/ui/passwordvalidator";
import TextField from "@/components/ui/textfield";
import { useToast } from "@/components/ui/use-toast";
import { passwordCheck } from "@/utils/passwordCheck";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Camera } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateProfile() {
  const navigate = useNavigate();
  const {toast} = useToast();

  const [user, setUser] = useState<{
    photo: File | null,
    name: string,
    surname: string,
    email: string,
    password: string,
  }>({
    photo: null,
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const [validations, setValidations] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    minLength: false,
    hasSymbol: false,
  });
  const [passwordValid, setPasswordValid] = useState(false);

  const rules = [
      "Maiúscula",
      "Minúscula",
      "Número",
      "8 Dígitos",
      "Símbolo"
  ];
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  interface CreationResponse{
    message: string;
    token: string;
  }
  
  const mutation = useMutation<CreationResponse, Error, FormData>({
    mutationFn: (data: FormData) => {return api.createProfile(data)}
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!passwordValid){
      console.log('senha não é válida');
      return;
    }

    const formData = new FormData();

    for (const [key, value] of Object.entries(user)){
      formData.append(key, value as string | File);
    }

    try{
        mutation.mutate(formData, {
          onSuccess: (data) => {
              console.log(data);
              Cookies.set("token", data.token);
              navigate("/dashboard");
          },
          onError: () => {
            toast({
              title: "Tivemos um problema ao tentar criar a sua conta",
              variant: "destructive",
              duration: 2000,
            })
          }
        })
    }catch(err){
      console.error(err);
    }    
    
  };

  const triggerInputFile = () => {
    const inputFile = document.getElementById('photoFile');
    inputFile?.click();
  }

  const changeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files === null){
      return;
    }
    const file = e.target.files[0];
    setUser((prevState) => ({
      ...prevState,
      "photo": file
    }))
  }

  const handlePasswordValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const passValidations = passwordCheck(password);
    setValidations(passValidations);

    if(!Object.values(passValidations).every((check) => check === true)){
      setPasswordValid(false);
      return;
    }

    setPasswordValid(true);
    setUser((prevState) => ({
      ...prevState,
      "password": password
    }))
  }

  return (
    <div className="h-dvh flex flex-col bg-surface">
      <AppBar title="Configurar Conta" />
      <div className="container flex flex-1 py-10">
          <form className="flex flex-col flex-1 justify-between" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2" onClick={triggerInputFile}>
                <Input id="photoFile" type="file" className="hidden" onChange={changeInputFile} />
                {!user.photo && (
                  <div className="flex bg-primary text-neutral-950 py-11 px-11 rounded-full">
                    <Camera />
                  </div>
                )}
                {user.photo && (
                    <img src={URL.createObjectURL(user.photo)} alt="User profile picture" className="h-28 w-28 rounded-full"/>
                )}
                <Button variant={"ghost"}>Escolher uma foto</Button>
              </div>

              <TextField
                id="name"
                label="Nome"
                required={true}
                onChange={handleChange}
              />
              <TextField id="surname" label="Sobrenome" required={true} onChange={handleChange} />
              <TextField id="username" label="Nome de Usuário" required={true} onChange={handleChange} />
              <TextField id="email" label="Email" required={true} onChange={handleChange}/>
              <div className="flex flex-col gap-2.5">
                <TextField type="password" id="password" label="Senha"  required={true} onChange={handlePasswordValidation} />
                <PasswordValidator validations={validations} rules={rules}/>
              </div>
            </div>

            <Button
              size={"lg"}
              type="submit"
              className="w-full"
            >
              Continuar
            </Button>
          </form>
      </div>
    </div>
  );
}
