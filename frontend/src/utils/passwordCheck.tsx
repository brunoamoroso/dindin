export const passwordCheck = (password: string) => {
        return {
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            minLength: password.length >= 8,
            hasSymbol: /[\W_]/.test(password)
        };
}