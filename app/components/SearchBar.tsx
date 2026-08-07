import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Buscar..." }: SearchBarProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-all duration-300 shadow-sm"
      />
    </div>
  )
}