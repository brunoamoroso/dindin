interface IPasswordValidator{
    validations: object;
    rules: string[];
}

function PasswordValidator({validations, rules}: IPasswordValidator){

    return(
        <div className="flex gap-3">
            {Object.values(validations).map((valid, index) => (
                <div key={index} className="flex flex-1 flex-col gap-1 items-center">
                    <div className={`flex h-1.5 w-full rounded-full ${valid ? "bg-primary" : "bg-container0"}`}></div>
                    <div className="flex text-body label-small">{rules[index]}</div>
                </div>
            ))}
        </div>
    )
}

export default PasswordValidator;