type ArrowDownProps = { className: string };

const ArrowDown: React.FC<ArrowDownProps> = ({ className }) => {
  return (
    <svg className={`${className}`} viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" strokeWidth="2" stroke="currentColor" />
    </svg>
  );
};

export default ArrowDown;
