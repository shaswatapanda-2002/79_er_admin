import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/subscription-plans";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  const hasDecimals = Math.round(price * 100) % 100 !== 0;
  return hasDecimals ? price.toFixed(2) : String(price);
}

export function PlanCard({
  plan,
  onChoosePlan,
}: {
  plan: Plan;
  onChoosePlan?: () => void;
}) {
  const isPopular = !!plan.popular;
  const isInactive = plan.status === "inactive";

  const pricePrefix =
    plan.currency && plan.currency !== "USD" ? `${plan.currency} ` : "$";

  return (
    <Card
      className={cn(
        "relative rounded-2xl border bg-white shadow-sm w-[260px] transition",
        isPopular ? "border-orange-400 shadow-md" : "border-gray-200",
        isInactive && "opacity-70"
      )}
    >
      {isPopular ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="rounded-full bg-orange-500 text-white hover:bg-orange-500 px-3 py-1 text-[11px]">
            Most Popular
          </Badge>
        </div>
      ) : null}

      {isInactive ? (
        <div className="absolute top-3 right-3">
          <Badge className="rounded-full bg-gray-200 text-gray-700 hover:bg-gray-200 px-3 py-1 text-[11px]">
            Inactive
          </Badge>
        </div>
      ) : null}

      <CardContent className="p-6 text-center">
        <div className="text-sm font-semibold">{plan.name}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {plan.subtitle || ""}
        </div>

        <div className="mt-4">
          <span className="text-2xl font-semibold">
            {pricePrefix}
            {formatPrice(plan.price)}
          </span>
          <span className="text-xs text-muted-foreground">/{plan.cycle}</span>
        </div>

        <div className="mt-4 text-xs text-muted-foreground leading-5">
          {plan.description}
        </div>

        <div className="mt-6">
          <Button
            className={cn(
              "w-full rounded-xl",
              isPopular
                ? "bg-orange-600 hover:bg-orange-600 text-white"
                : "bg-slate-900 hover:bg-slate-900 text-white"
            )}
            variant="default"
            onClick={onChoosePlan}
            type="button"
          >
            {isInactive ? "Edit Plan" : plan.cta}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}