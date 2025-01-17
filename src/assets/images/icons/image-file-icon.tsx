import { SVGProps } from 'react'

export default function ImageFileIcon(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      enableBackground="new 0 0 48 48"
      {...props}
    >
      <polygon fill="#90CAF9" points="40,45 8,45 8,3 30,3 40,13" />
      <polygon fill="#E1F5FE" points="38.5,14 29,14 29,4.5" />
      <polygon fill="#1565C0" points="21,23 14,33 28,33" />
      <polygon fill="#1976D2" points="28,26.4 23,33 33,33" />
      <circle fill="#1976D2" cx="31.5" cy="24.5" r="1.5" />
    </svg>
  )
}
