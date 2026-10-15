import { CountUp } from "@/components/oss/CountUp";

const rows = [
  { name: "The Starter", days: "5 to 7 days" },
  { name: "The Sorted", days: "7 to 10 days" },
  { name: "The Works", days: "10 to 14 days" },
];

/** One plain statement: how long a site takes, by package. The numbers count up once as it scrolls into view. */
export function DaysCounter() {
  return (
    <section className="hm-days" data-tone="dark" aria-labelledby="days-title">
      <p className="hm-days__lab" id="days-title">How long it takes</p>
      <div className="hm-days__big">
        <b><CountUp to={5} /></b>
        <span>to</span>
        <b><CountUp to={14} /></b>
        <span>days</span>
      </div>
      <p className="hm-days__line">From the day we have your content to the day your site is live. How long depends on the package.</p>
      <ul className="hm-days__rows">
        {rows.map((r) => (
          <li key={r.name}>
            <span>{r.name}</span>
            <i>{r.days}</i>
          </li>
        ))}
      </ul>
      <p className="hm-days__note">These are estimates. Late content moves the date.</p>
    </section>
  );
}
