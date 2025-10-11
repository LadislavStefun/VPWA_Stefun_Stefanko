export type ValidationRule = (val: string) => boolean | string;

export const validationRules = {
    required: (fieldName: string = "This field"): ValidationRule => (val: string) =>
        !!val?.trim() || `${fieldName} is required`,

    email: (): ValidationRule => (val: string) => {
        if (!val?.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) || "Please enter a valid email address";
    },

    password: (minLength: number = 8): ValidationRule => (val: string) => {
        if (!val?.trim()) return "Password is required";
        if (val.length < minLength)
            return `Password must be at least ${minLength} characters long`;
        return true;
    },

    minLength: (min: number, fieldName: string = "This field"): ValidationRule => (
        val: string
    ) => {
        if (!val?.trim()) return `${fieldName} is required`;
        return val.length >= min || `${fieldName} must be at least ${min} characters long`;
    },

    maxLength: (max: number, fieldName: string = "This field"): ValidationRule => (
        val: string
    ) =>
        !val ||
        val.length <= max ||
        `${fieldName} must be no more than ${max} characters long`,

    nickname: (): ValidationRule => (val: string) => {
        if (!val?.trim()) return "Nickname is required";
        if (val.length < 3) return "Nickname must be at least 3 characters long";
        if (val.length > 20) return "Nickname must be no more than 20 characters long";
        return true;
    },

    name: (fieldName: string): ValidationRule => (val: string) => {
        if (!val?.trim()) return `${fieldName} is required`;
        if (val.length < 2) return `${fieldName} must be at least 2 characters long`;
        if (val.length > 50) return `${fieldName} must be no more than 50 characters long`;
        return true;
    },


};

export const commonRules = {
    emailField: [validationRules.email()],
    passwordField: [validationRules.password(8)],
    firstNameField: [validationRules.name("First name")],
    lastNameField: [validationRules.name("Last name")],
    nicknameField: [validationRules.nickname()],
    requiredTextField: (fieldName: string) => [validationRules.required(fieldName)],
};
