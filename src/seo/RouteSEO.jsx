import { useLocation } from "react-router-dom";
import SEO from "./SEO";
import { routeSeo } from "./seoConfig";

const pathToPage = new Map(
  Object.entries(routeSeo).map(([key, value]) => [value.path, key])
);

export default function RouteSEO() {
  const { pathname } = useLocation();
  const page = pathToPage.get(pathname);

  if (!page) return null;

  return (
    <SEO
      page={page}
      breadcrumbs={[
        { name: "Overview", path: "/" },
        ...(pathname === "/" ? [] : [{ name: routeSeo[page].title.split(" - ")[0], path: pathname }]),
      ]}
    />
  );
}
