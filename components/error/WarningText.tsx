import Link from 'next/link';

interface WarningTextProps {
  code: number;
  title: string;
  description: string;
}

const WarningText = ({ code, title, description }: WarningTextProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-8xl font-bold text-red-500 animate-pulse mb-4">{code}</h1>
      <h2 className="text-2xl dark:text-white mb-4">{title}</h2>
      <p className="text-gray-400 pixel-font text-sm mb-8">{description}</p>
      <Link href={'/'} className="dark:text-white">
        돌아가기
      </Link>
    </div>
  );
};

export default WarningText;
