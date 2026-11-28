import { useI18n } from "@/lib/i18n";
import { FEE_MAX, FEE_MIN, formatKzt } from "@/lib/money";

const samples = [25000, 80000];

export function FeeTable() {
  const { t } = useI18n();
  const labels = [t.exampleLow, t.exampleHigh];

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-muted">
          <tr>
            <th className="px-3 py-3 font-medium">{t.feeYouPay}</th>
            <th className="px-3 py-3 font-medium">{t.feePlatform}</th>
            <th className="px-3 py-3 font-medium">{t.feeGuide}</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((price, index) => (
            <tr key={price} className="border-t border-line bg-surface">
              <td className="px-3 py-3 text-cream">
                {labels[index]}
                <span className="mt-1 block tabular-nums text-fg">{formatKzt(price)}</span>
              </td>
              <td className="px-3 py-3 tabular-nums text-copper">
                {formatKzt(Math.round(price * FEE_MIN))} – {formatKzt(Math.round(price * FEE_MAX))}
              </td>
              <td className="px-3 py-3 tabular-nums text-fg">
                {formatKzt(price - Math.round(price * FEE_MAX))} – {formatKzt(price - Math.round(price * FEE_MIN))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
