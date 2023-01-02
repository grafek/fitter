import { type UseFormRegister, type Path } from "react-hook-form";
import { type IAddPostFormInput } from "../Posts/AddPost";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<IAddPostFormInput>;
  register: UseFormRegister<IAddPostFormInput>;
  className?: string;
  required: boolean;
  type: string;
  placeholder: string;
}

const Input = ({
  name,
  register,
  required,
  className,
  type,
  placeholder,
  ...props
}: InputProps) => {
  return (
    <>
      <label htmlFor={name} />
      <input
        {...register(name, { required })}
        id={name}
        placeholder={placeholder}
        className={`${className} rounded-md px-3 py-1 outline outline-1 outline-gray-300`}
        required={required}
        type={type}
        {...props}
      />
    </>
  );
};

export default Input;
