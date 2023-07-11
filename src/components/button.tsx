import { type ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props) {
  return (
    <button
      className="rounded-lg border-2 border-black bg-amber-100 p-2 font-bold uppercase hover:bg-amber-200 disabled:bg-gray-200"
      {...props}
    />
  );
}
