import {
  type UseFormRegister,
  type Path,
  type RegisterOptions,
  type FieldError,
} from "react-hook-form";
import setCapitalized from "../../utils/setCapitalized";
import { type IAddPostFormInput } from "../Posts/AddPost";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<IAddPostFormInput>;
  register: UseFormRegister<IAddPostFormInput>;
  className?: string;
  type: string;
  placeholder: string;
  errors: FieldError | undefined;
  validation: RegisterOptions<IAddPostFormInput>;
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
  const errorClassses = errors ? "outline-red-500" : null;

  return (
    <>
      <label htmlFor={name} />
      <input
        {...register(name, validation)}
        id={name}
        placeholder={placeholder}
        className={`${className} ${errorClassses} w-full rounded-md px-3 py-1 outline outline-1 outline-gray-300`}
        type={type}
        {...props}
      />

      {errors?.type === "required" ? (
        <span role={"alert"} className="text-sm text-red-500">
          {setCapitalized(name)} is required!
        </span>
      ) : null}
    </>
  );
};

export default Input;
