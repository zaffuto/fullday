'use client';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const presetColors = [
    '#000000', // Negro
    '#1F2937', // Gris oscuro
    '#DC2626', // Rojo
    '#2563EB', // Azul
    '#059669', // Verde
    '#7C3AED', // Púrpura
    '#D97706', // Naranja
    '#DB2777', // Rosa
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded cursor-pointer"
        />
        <div className="flex space-x-1">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className="w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
