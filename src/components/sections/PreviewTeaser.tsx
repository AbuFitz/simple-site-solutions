import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { categories } from "@/lib/preview/categories";
import { encodeInput, defaultInput, inferCategory } from "@/lib/preview/generate";
import type { CategoryId } from "@/lib/preview/types";

/** Home page entry point to the preview generator: two fields, then straight into the live preview. */
export function PreviewTeaser() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("plumbing");
  const [touched, setTouched] = useState(false);

  const onName = (v: string) => {
    setName(v);
    const g = inferCategory(v);
    if (g && !touched) setCategory(g);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === category)!;
    navigate(`/preview?${encodeInput({ ...defaultInput(), name, category, action: cat.defaultAction })}`);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16" aria-labelledby="teaser-title">
      <div className="content-width">
        <motion.div
          className="bordered-section-lg relative p-5 sm:p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <DottedGrid className="opacity-20" spacing={24} />
          <div className="relative z-10 grid gap-6 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <span className="badge-primary mb-3 inline-block text-[9px] sm:text-xs">Website preview</span>
              <h2 id="teaser-title" className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                See what your website <span className="text-primary">could look like</span>
              </h2>
              <p className="text-body mt-3 max-w-md">Add your business name and trade. We build a preview on the layout that already works in your industry. Nothing is sent or stored.</p>
            </div>
            <form onSubmit={submit} className="space-y-3" aria-label="Start a website preview">
              <div>
                <label htmlFor="teaser-name" className="mb-1.5 block text-sm font-medium">
                  Business name
                </label>
                <input id="teaser-name" className="input-base" placeholder="e.g. Smith & Sons Plumbing" maxLength={60} value={name} onChange={(e) => onName(e.target.value)} autoComplete="organization" />
              </div>
              <div>
                <label htmlFor="teaser-cat" className="mb-1.5 block text-sm font-medium">
                  Type of business
                </label>
                <select
                  id="teaser-cat"
                  className="input-base"
                  value={category}
                  onChange={(e) => {
                    setTouched(true);
                    setCategory(e.target.value as CategoryId);
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary btn-lg w-full gap-2 !text-background sm:w-auto">
                Show my preview
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
