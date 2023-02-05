import {
  type UseFormRegister,
  type RegisterOptions,
  type Path,
  type FieldValues,
  type FieldError,
  type UnPackAsyncDefaultValues,
} from "react-hook-form";
import FormError from "./FormError";

export interface SelectProps<T extends FieldValues>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  name: Path<UnPackAsyncDefaultValues<T>>;
  labelname?: string;
  register: UseFormRegister<T>;
  className?: string;
  errors?: FieldError;
  validation?: RegisterOptions<T>;
  required?: boolean;
}

const Select = <T extends FieldValues>({
  name,
  register,
  validation,
  className = "",
  options,
  errors,
  required,
  labelname,
  ...props
}: SelectProps<T>) => {
  const errorClassses = errors ? "outline-red-500" : "outline-gray-300";
  const requiredAsterisk = required ? (
    <span className="font-semibold text-red-500">*</span>
  ) : null;

  return (
    <>
      <label htmlFor={name}>
        {labelname} {requiredAsterisk}
      </label>
      <select
        {...register(name, validation)}
        id={name}
        className={`${className} ${errorClassses}  w-full rounded-md bg-[#f6f8fa] p-2 outline outline-1 dark:bg-[#161b22] dark:outline-[#30363d]`}
        {...props}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FormError fieldErrors={errors} />
    </>
  );
};
export default Select;
