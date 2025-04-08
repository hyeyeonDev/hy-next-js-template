import Link from 'next/link';

export default function Logo() {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link href={{ pathname: '/' }}>
        <span className="text-xl font-bold">Template</span>
      </Link>
    </div>
  );
}
