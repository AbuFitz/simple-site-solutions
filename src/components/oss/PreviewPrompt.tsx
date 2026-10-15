import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/lib/preview/categories";
import { encodeInput, defaultInput, inferCategory } from "@/lib/preview/generate";
import type { CategoryId } from "@/lib/preview/types";

/** The one working tool on the home page: type a business name, pick a trade, land on a live preview. Nothing is sent or stored. */
export function PreviewPrompt() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("plumbing");
  const [touched, setTouched] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === category)!;
    navigate(`/preview?${encodeInput({ ...defaultInput(), name, category, action: cat.defaultAction })}`);
  };

  return (
    <section className="hm-try" data-tone="dark" aria-labelledby="try-title">
      <h2 id="try-title">See your site first.</h2>
      <form onSubmit={submit} aria-label="Preview your website">
        <label htmlFor="try-name">Business name</label>
        <input
          id="try-name"
          placeholder="Smith & Sons Plumbing"
          maxLength={60}
          value={name}
          autoComplete="organization"
          onChange={(e) => {
            setName(e.target.value);
            const g = inferCategory(e.target.value);
            if (g && !touched) setCategory(g);
          }}
        />
        <label htmlFor="try-cat">Type of business</label>
        <select id="try-cat" value={category} onChange={(e) => { setTouched(true); setCategory(e.target.value as CategoryId); }}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <button type="submit">Show my preview <span aria-hidden="true">&#8594;</span></button>
        <p>Built on the layout that already works in your trade. Nothing is sent or stored.</p>
      </form>
    </section>
  );
}
