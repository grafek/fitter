import { type FieldError } from "react-hook-form";
type FormErrorProps = {
  fieldErrors?: FieldError;
  errors?: string;
};

const FormError: React.FC<FormErrorProps> = ({ fieldErrors, errors }) => {
  return fieldErrors || errors ? (
    <span role={"alert"} className="text-sm text-red-500 md:text-base">
      {fieldErrors ? fieldErrors.message : errors}
    </span>
  ) : null;
};

export default FormError;
