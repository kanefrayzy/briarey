import CheckboxCheckmarkIcon from '../icons/CheckboxCheckmarkIcon'

interface FormCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
}

export default function FormCheckbox({ checked, onChange, children }: FormCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none group">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors"
        style={{
          background: 'transparent',
          border: `1.5px solid ${checked ? '#AC7F5E' : 'rgba(255,255,255,0.3)'}`,
        }}
      >
        {checked && (
          <CheckboxCheckmarkIcon />
        )}
      </button>
      <span className="text-brand-gray text-xs leading-relaxed group-hover:text-white/80 transition-colors">
        {children}
      </span>
    </label>
  )
}
