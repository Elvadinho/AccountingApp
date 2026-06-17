import { getCategoryColor } from '../../utils/categories';

export default function Badge({ category, className = '' }) {
  const color = getCategoryColor(category);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {category}
    </span>
  );
}
