export default function TruckIcon({ stroke = '#7A563E' }: { stroke?: string }) {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <path d="M1 1h12v11H1V1ZM13 5h4l3 3v5h-7V5Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="5" cy="15" r="2" stroke={stroke} strokeWidth="1.5"/>
      <circle cx="17" cy="15" r="2" stroke={stroke} strokeWidth="1.5"/>
    </svg>
  )
}
