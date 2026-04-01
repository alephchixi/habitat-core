type Props = {
  className?: string;
};

export function LogoMark({ className }: Props) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="42" y="94" width="44" height="22" rx="3.5" />
        <path d="M64 94V24" />
        <path d="M64 94L58 88C56 86 54 83 54 79V77C54 73 52 69 49 66L28 45" />
        <path d="M49 66V30" />
        <path d="M64 50L86 28" />
        <path d="M70 94V79C70 75 72 70 75 67L104 38" />
      </g>
      <g fill="currentColor">
        <circle cx="64" cy="18" r="5.5" />
        <circle cx="49" cy="24" r="5.5" />
        <circle cx="28" cy="45" r="5.5" />
        <circle cx="86" cy="28" r="5.5" />
        <circle cx="104" cy="38" r="5.5" />
      </g>
    </svg>
  );
}
