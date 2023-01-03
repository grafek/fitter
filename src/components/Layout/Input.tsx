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
  type: string;
  placeholder: string;
  errors: FieldError | undefined;
  validation: RegisterOptions<AddPostFormSchema>;
}

const Input = ({
  name,
  register,
  className = "",
  type,
  placeholder,
  errors,
  validation,
  ...props
}: InputProps) => {
  const errorClassses = errors ? "outline-red-500" : "outline-gray-300";

  return (
    <>
      <label htmlFor={name}>{setCapitalized(name)}</label>
      <input
        {...register(name, validation)}
        id={name}
        placeholder={placeholder}
        className={`${className} ${errorClassses} w-full rounded-md px-3 py-1 outline outline-1`}
        type={type}
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
