import Link from "next/link";
import { breadcrumbData, type Breadcrumb } from "@/lib/seo/structured-data";
import { JsonLd } from "./json-ld";

export function Breadcrumbs({ items }: { items: readonly Breadcrumb[] }) {
  return <>
    <nav aria-label="Ruta de navegación" className="breadcrumbs">
      <ol>{items.map((item, index) => <li key={item.path}>
        {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}
      </li>)}</ol>
    </nav>
    <JsonLd data={breadcrumbData(items)} />
  </>;
}
