interface MetaRow {
  label: string;
  value: string;
  mono?: boolean;
}

/** A compact definition list for read-only account details. */
export function AccountMeta({ rows }: { rows: MetaRow[] }) {
  return (
    <dl className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-0.5">
          <dt className="font-mono text-micro uppercase tracking-[0.12em] text-ink_text-faint">
            {row.label}
          </dt>
          <dd
            className={`text-sm text-lilac ${row.mono ? "mono break-all" : ""}`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
