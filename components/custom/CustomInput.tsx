import React, { FC, SVGProps } from 'react';

interface CustomInputProps {
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[] | undefined;
  icon?: FC<SVGProps<SVGSVGElement>> | undefined;
  rightIcon?: FC<SVGProps<SVGSVGElement>> | undefined;
  tabIndex?: number;
  placeholder?: string;
  pattern?: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  checked?: boolean | undefined;
}

const CustomInput: React.FC<CustomInputProps> = ({
  onClick,
  onChange,
  onKeyDown,
  id,
  name,
  type = 'text',
  value,
  icon,
  rightIcon,
  tabIndex,
  placeholder,
  pattern,
  maxLength,
  disabled,
  required = false,
  autoComplete,
  checked,
}) => {
  const LeftIcon = icon;
  const RightIcon = rightIcon;

  return (
    <>
      <div className="flex w-full my-2 py-1 rounded-md text-dark dark:text-white bg-transparent">
        <div className="relative w-full">
          {LeftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LeftIcon />
            </div>
          )}
          {RightIcon && (
            <div
              data-testid="right-icon"
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <RightIcon />
            </div>
          )}
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onClick={onClick}
            onKeyDown={onKeyDown}
            tabIndex={tabIndex}
            placeholder={placeholder}
            pattern={pattern}
            maxLength={maxLength}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            checked={checked}
            className={`block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 ${
              LeftIcon && 'pl-10'
            }  focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg`}
          />
        </div>
      </div>
    </>
  );
};

export default CustomInput;
