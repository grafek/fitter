import type {
  UseFormRegister,
  RegisterOptions,
  Path,
  FieldValues,
  FieldError,
} from "react-hook-form";
import { FormError } from ".";

export interface TextAreaProps<T extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: Path<T>;
  labelname?: string;
  register: UseFormRegister<T>;
  className?: string;
  errors?: FieldError;
  validation?: RegisterOptions<T>;
  required?: boolean;
}

const TextArea = <T extends FieldValues>({
  name,
  register,
  validation,
  className,
  errors,
  labelname,
  required,
  ...props
}: TextAreaProps<T>) => {
  const errorClassses = errors
    ? "outline-red-500"
    : "focus:outline-blue-500 outline-[#30363d] ";
  const requiredAsterisk = required ? (
    <span className="font-semibold text-red-500">*</span>
  ) : null;

  return (
    <>
      <label htmlFor={name}>
        {labelname} {requiredAsterisk}
      </label>
      <textarea
        {...register(name, validation)}
        id={name}
        className={`${className} ${errorClassses} max-h-[200px] min-h-[80px] w-full rounded-md bg-[#f6f8fa] px-3 py-2 outline outline-1 dark:bg-[#161b22] `}
        {...props}
      />

      <FormError fieldErrors={errors} />
    </>
  );
};

export default TextArea;
