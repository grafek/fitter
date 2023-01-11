import {
  type UseFormRegister,
  type Path,
  type RegisterOptions,
  type FieldError,
} from "react-hook-form";
import { type AddPostFormSchema } from "../../schemas/post.schema";
import setCapitalized from "../../utils/setCapitalized";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<AddPostFormSchema>;
  register: UseFormRegister<AddPostFormSchema>;
  className?: string;
  errors: FieldError | undefined;
  validation: RegisterOptions<AddPostFormSchema>;
  required?: boolean;
}

const Input = ({
  name,
  register,
  className = "",
  errors,
  validation,
  required,
  ...props
}: InputProps) => {
  const errorClassses = errors ? "outline-red-500" : "outline-gray-300";
  const requiredAsterisk = required ? (
    <span className="font-semibold text-red-500">*</span>
  ) : null;

  return (
    <>
      <label htmlFor={name}>
        {setCapitalized(name)}
        {requiredAsterisk}
      </label>
      <input
        {...register(name, validation)}
        id={name}
        className={`${className} ${errorClassses} w-full rounded-md py-2 px-3 outline outline-1 bg-[#f6f8fa] dark:outline-[#30363d] dark:bg-[#161b22]`}
        {...props}
      />
      {errors ? (
        <span role={"alert"} className="text-sm text-red-500">
          {errors.message}
        </span>
      ) : null}
    </>
  );
};

export default Input;
