export const ValidatorErrorsDict = {
    required: 'Campo Richeisto',
    email: 'Email non valida',
    mustMatch: 'I Campi non coincidono',
    minlength: 'Campo troppo corto',
};

export function ValidatorErrorsText(err: string, ...errArgs: any[]): string {
    switch (err){
        case 'email': return ValidatorErrorsDict['email'];
        case 'required': return ValidatorErrorsDict['required'];
        case 'minlength': return `${ValidatorErrorsDict['minlength']}; Lunghezza minima ${errArgs[0].requiredLength}`;
        case 'mustMatch': return 'Le password non coincidono.';
        default:
    }
}
