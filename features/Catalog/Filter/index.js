import Link from 'next/link';

const Filter = ({ options, selected }) => (
  <nav aria-label='Categorías de productos'>
    <ul>
      {options.map((item) => {
        const isSelected = selected.id === item.id;
        const href = item.id === 'all' ? '/productos' : `/productos?category=${item.id}`;

        return (
          <li key={`filter-by-${item.id}`}>
            <Link
              href={href}
              aria-current={isSelected ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Filter;
