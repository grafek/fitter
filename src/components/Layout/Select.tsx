import { type UseFormRegister, type Path } from "react-hook-form";
import { type IAddPostFormInput } from "../Posts/AddPost";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: Path<IAddPostFormInput>;
  register: UseFormRegister<IAddPostFormInput>;
  className?: string;
  required: boolean;
  options: string[];
}

const Select = ({
  name,
  register,
  required,
  className,
  options,
  ...props
}: SelectProps) => {
  return (
    <>
      <label htmlFor={name} />
      <select
        {...register(name, { required })}
        id={name}
        className={`${className}`}
        required={required}
        {...props}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};
export default Select;
